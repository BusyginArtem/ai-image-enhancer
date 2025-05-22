// import PageAnimateFadeWrapper from "@/components/animate/PageAnimateFadeWrapper";

import Image from "next/image";

export default async function Dashboard() {
  return (
    // <PageAnimateFadeWrapper>
    <main className="container py-10 text-center lg:pt-12">
      <div className="-m-6 flex flex-wrap items-center pt-24 pb-24 md:pt-32">
        <div className="w-full p-6 lg:w-1/2">
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
        <div className="h-min-[18rem] relative aspect-video w-full lg:w-1/2">
          <Image
            fill={true}
            src="https://res.cloudinary.com/dtrl8p5mc/image/upload/v1747840884/Gemini_Generated_Image_q7ow18q7ow18q7ow_1_znitwu.jpg"
            alt="An example of inpainting"
            className="rounded-lg px-6 shadow-2xl"
          />
        </div>
      </div>
    </main>
    // </PageAnimateFadeWrapper>
  );
}
