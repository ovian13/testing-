import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-neutral-50 text-neutral-900">
      <h1 className="text-6xl font-bold text-primary mb-4">Project Eakalaiva</h1>
      <p className="text-xl mb-8">If you cannot change the college you came from, change what you can prove.</p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          Login
        </Link>
        <Link href="/register" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          Register
        </Link>
      </div>
    </main>
  );
}
