from unittest.mock import AsyncMock, MagicMock
from io import BytesIO
import os
import tempfile
import shutil
import uuid

from fastapi.testclient import TestClient
from fastapi import HTTPException, UploadFile
import pytest

from main import app, UPLOAD_FOLDER, upload_image, process_image

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_upload_folder():
    """Ensure uploads folder exists before each test and is cleaned up after."""
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    yield
    shutil.rmtree(UPLOAD_FOLDER, ignore_errors=True)


# def test_upload_image_success(tmp_path):
#     """Test successful image upload."""
#     test_image_path = tmp_path / "test_image.jpg"
#     test_image_path.write_bytes(os.urandom(1024))

#     with test_image_path.open("rb") as img:
#         response = client.post("/inpaint/upload", files={"file": ("test_image.jpg", img, "image/jpeg")})

#     assert response.status_code == 200
#     assert "filename" in response.json()
#     filename = response.json()["filename"]
#     assert os.path.exists(os.path.join(UPLOAD_FOLDER, filename))


# def test_upload_image_invalid_extension(tmp_path):
#     """Test uploading file with invalid extension."""
#     bad_file_path = tmp_path / "test.txt"
#     bad_file_path.write_text("dummy text", encoding="utf-8")

#     with bad_file_path.open("rb") as f:
#         response = client.post("/inpaint/upload", files={"file": ("test.txt", f, "text/plain")})

#     assert response.status_code == 400
#     assert response.json()["detail"] == "Unsupported file type"

@pytest.mark.asyncio
async def test_upload_image_success(tmp_path):
    """Test successful image upload."""

    test_file_path = tmp_path / "test_image.png"
    test_file_path.write_bytes(b"test image data")

    with open(test_file_path, "rb") as f:
        upload_file = UploadFile(file=f, filename="test_image.png")

        response = upload_image(file=upload_file)
        assert "filename" in response
        assert response["filename"].startswith("test_image-")
        assert response["filename"].endswith(".png")
        uploaded_file_path = os.path.join(UPLOAD_FOLDER, response["filename"])
        assert os.path.exists(uploaded_file_path)
        os.remove(uploaded_file_path)


@pytest.mark.asyncio
async def test_upload_image_invalid_extension(tmp_path):
    """Test image upload with an invalid file extension."""

    test_file_path = tmp_path / "test_image.txt"
    test_file_path.write_bytes(b"test text data")

    with open(test_file_path, "rb") as f:
        upload_file = UploadFile(file=f, filename="test_image.txt")

        with pytest.raises(HTTPException) as excinfo:
            upload_image(file=upload_file)
        assert excinfo.value.status_code == 400
        assert "Unsupported file type" in excinfo.value.detail


@pytest.mark.asyncio
async def test_process_image_success(monkeypatch):
    """Test successful image processing."""
    # Create a dummy image file in the upload folder
    test_image_name = f"test-{uuid.uuid4()}.png"
    image_path = os.path.join(UPLOAD_FOLDER, test_image_name)

    with open(image_path, "wb") as f:
        f.write(os.urandom(1024))

    # Create a dummy mask file
    mask_data = os.urandom(1024)

    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(mask_data)
        mask_file = temp_file.name

    # Mock the external Lama Cleaner response
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.content = b"processed_image_data"

    async def mock_post(*args, **kwargs):
        print(f"args: {args}")
        print(f"kwargs: {kwargs}")
        return mock_response

    monkeypatch.setattr("httpx.AsyncClient.post", mock_post)

    mask_file = UploadFile(filename="mask.png", file=BytesIO(mask_data))
    response = await process_image(image_unique_name=test_image_name, mask=mask_file)

    assert response.status_code == 200
    assert response.body == b"processed_image_data"
    assert response.headers["content-type"] == "image/png"
    assert not os.path.exists(image_path)


@pytest.mark.asyncio
async def test_process_image_failure(monkeypatch):
    """Test image processing failure due to Lama Cleaner."""
    # Create a dummy image file in the upload folder
    test_image_name = f"test-{uuid.uuid4()}.png"
    image_path = os.path.join(UPLOAD_FOLDER, test_image_name)

    with open(image_path, "wb") as f:
        f.write(os.urandom(1024))

    # Create a dummy mask file
    mask_data = os.urandom(1024)

    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(mask_data)
        mask_file = temp_file.name

    # Mock a failed Lama Cleaner response
    mock_response = AsyncMock()
    mock_response.status_code = 500
    mock_response.text = "Lama Cleaner failed"

    async def mock_post(*args, **kwargs):
        print(f"args: {args}")
        print(f"kwargs: {kwargs}")
        return mock_response

    monkeypatch.setattr("httpx.AsyncClient.post", mock_post)

    with pytest.raises(HTTPException) as excinfo:
        mask_file = UploadFile(filename="mask.png", file=BytesIO(mask_data))
        await process_image(image_unique_name=test_image_name, mask=mask_file)

    assert excinfo.value.status_code == 500
    assert "Processing failed: Lama Cleaner failed" in excinfo.value.detail
    assert not os.path.exists(image_path)


@pytest.mark.asyncio
async def test_process_image_not_found():
    """Test processing an image that doesn't exist."""
    mask_data = os.urandom(1024)
    mask_file = MagicMock(spec=BytesIO)
    mask_file.read.return_value = mask_data
    mask_file.filename = "mask.png"
    mask_file.content_type = "image/png"

    with pytest.raises(HTTPException) as excinfo:
        await process_image(image_unique_name="non_existent_image.png", mask=mask_file)
    assert excinfo.value.status_code == 404
    assert "Image file not found." in excinfo.value.detail


@pytest.mark.asyncio
async def test_process_image_invalid_path():
    """Test processing with an invalid image path."""
    mask_data = os.urandom(1024)
    mask_file = MagicMock(spec=BytesIO)
    mask_file.read.return_value = mask_data
    mask_file.filename = "mask.png"
    mask_file.content_type = "image/png"

    with pytest.raises(HTTPException) as excinfo:
        await process_image(image_unique_name="../outside_upload_folder.png", mask=mask_file)
    assert excinfo.value.status_code == 400
    assert "Invalid file path." in excinfo.value.detail
