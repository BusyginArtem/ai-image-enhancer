import Image from "next/image";

export default function ImagePreview({ imageUrl }: { imageUrl: string }) {
  return (
    <div className='p-4'>
      <h3>Processed Image:</h3>
      <Image src={imageUrl} alt='Processed Image' width={500} height={500} className='border rounded shadow' />
    </div>
  );
}
