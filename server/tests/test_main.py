import os
import shutil
import uuid
import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
from main import app, UPLOAD_FOLDER

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_upload_folder():
    """Ensure uploads folder exists before each test and is cleaned up after."""
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    yield
    shutil.rmtree(UPLOAD_FOLDER, ignore_errors=True)


def test_upload_image_success(tmp_path):
    """Test successful image upload."""
    test_image_path = tmp_path / "test_image.jpg"
    test_image_path.write_bytes(os.urandom(1024))

    with test_image_path.open("rb") as img:
        response = client.post("/inpaint/upload", files={"file": ("test_image.jpg", img, "image/jpeg")})

    assert response.status_code == 200
    assert "filename" in response.json()
    filename = response.json()["filename"]
    assert os.path.exists(os.path.join(UPLOAD_FOLDER, filename))


def test_upload_image_invalid_extension(tmp_path):
    """Test uploading file with invalid extension."""
    bad_file_path = tmp_path / "test.txt"
    bad_file_path.write_text("dummy text", encoding="utf-8")

    with bad_file_path.open("rb") as f:
        response = client.post("/inpaint/upload", files={"file": ("test.txt", f, "text/plain")})

    assert response.status_code == 400
    assert response.json()["detail"] == "Unsupported file type"


@pytest.mark.asyncio
async def test_process_image_mocked(tmp_path, monkeypatch):
    """Test mocked image processing endpoint."""
    # Upload an image file
    test_image_name = f"test-{uuid.uuid4()}.png"
    image_path = os.path.join(UPLOAD_FOLDER, test_image_name)
    with open(image_path, "wb") as f:
        f.write(os.urandom(1024))

    # Create a dummy mask file
    mask_path = tmp_path / "mask.png"
    mask_path.write_bytes(os.urandom(1024))

    # Mocked external response
    class MockResponse:
        status_code = 200
        content = b"fake_image_data"

    def mock_post():
        return MockResponse()

    monkeypatch.setattr("main.requests.post", mock_post)

    async with AsyncClient(base_url="http://test") as ac:
        with mask_path.open("rb") as mask_file:
            response = await ac.post(
                "/inpaint/process",
                data={"image_unique_name": test_image_name},
                files={"mask": ("mask.png", mask_file, "image/png")}
            )

    assert response.status_code == 200
    assert response.content == b"fake_image_data"
    assert not os.path.exists(image_path)  # Ensure the image was deleted
