import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className='z-20 min-h-[80vh] flex items-center justify-center'>
      <div className='px-8 md:px-0 py-[4rem] sm:py-[5rem] md:py-[6.25rem] mx-auto sm:max-w-[37.5rem] md:max-w-[40.625rem] lg:max-w-[53.125rem] xl:max-w-[70rem]'>
        <h1 className='font-bold text-[7.9vw] md:text-[3.5rem] lg:text-[4rem] xl:text-[5rem] leading-[1.12]'>
          Page not found
        </h1>
        <div className='mt-5 text-center'>
          <Button size='lg' asChild>
            <Link href='/'>Back to Home page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
