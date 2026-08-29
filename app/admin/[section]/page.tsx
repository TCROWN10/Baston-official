import Link from "next/link";

export default function AdminSectionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-black">Admin section</h1>
        <p className="mt-2 text-sm text-gray-600">
          This admin module mirrors the overview navigation from the original app.
        </p>
        <Link href="/admin" className="mt-6 inline-block text-sm font-medium text-[#1e3a5f]">
          Back to overview
        </Link>
      </div>
    </div>
  );
}
