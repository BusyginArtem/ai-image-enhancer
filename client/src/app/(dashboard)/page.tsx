import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();
  console.log("session >>>>>>>>>>>>>>>>>>>>>", session);

  return (
    <main className="container py-10 text-center lg:pt-12">
      <Link href="/image-editor">
        <p className="btn btn-primary">Image Editor</p>
      </Link>
    </main>
  );
}
