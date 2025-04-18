export default async function Dashboard() {
  return (
    <main className="container py-10 text-center lg:pt-12">
      <div className="-m-6 flex flex-wrap items-center pt-24 pb-24 md:pt-32">
        <div className="w-full p-6 lg:w-1/2">
          <div className="lg:max-w-xl animate-slide-up [animation-delay:300ms] opacity-0">
            <h1 className="font-roboto text-foreground mb-8 text-3xl font-bold md:text-6xl text-start">
              Discover the power of AI image inpaint
            </h1>

            <p className="text-primary mb-10 text-xl text-start">
              Easily remove unwanted objects or edit parts of your image with
              just a few brush strokes online. The Lama inpainting neural
              network understands the context of your image and saves you hours
              of editing.
            </p>
          </div>
        </div>
        <div className="w-full p-6 lg:w-1/2"></div>
      </div>
    </main>
  );
}
