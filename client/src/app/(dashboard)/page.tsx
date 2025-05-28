import ExternalImage from "@/components/ui/image-post";

export default async function Dashboard() {
  return (
    <main className="container py-10 text-center lg:pt-12">
      <div className="-m-6 grid grid-cols-1 pt-24 pb-24 md:pt-32 lg:grid-cols-2 gap-8">
        <div className="w-full p-6">
          <div className="lg:max-w-xl">
            <h1 className="font-roboto text-foreground mb-8 text-start text-3xl font-bold md:text-6xl">
              Discover the power of AI image inpaint
            </h1>

            <p className="text-primary mb-10 text-start text-xl">
              Easily remove unwanted objects or edit parts of your image with
              just a few brush strokes online. The Lama inpainting neural
              network understands the context of your image and saves you hours
              of editing.
            </p>
          </div>
        </div>
        <div className="relative max-h-[75%] min-h-[16rem] max-w-[75%] min-w-[20rem] place-self-center sm:min-h-[25rem] sm:min-w-[30rem]">
          <ExternalImage
            fill={true}
            src="https://res.cloudinary.com/dtrl8p5mc/image/upload/v1748010203/robadb7wifuizlo5trvq.jpg"
            alt="An example of inpainting"
            className="px-6 shadow-2xl"
          />
        </div>
      </div>
    </main>
  );
}
