import Link from "next/link";

export default async function Dashboard() {
  return (
    <main className="container py-10 text-center lg:pt-12">
      <Link href="/image-editor">
        <p className="btn btn-primary">Image Editor</p>
      </Link>
    </main>
  );
}
