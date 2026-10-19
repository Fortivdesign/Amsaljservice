import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow">Sidan finns inte</p>
      <h1 className="mt-3 text-4xl font-semibold">Vi hittade inte sidan</h1>
      <p className="mt-3 text-ink-soft">Länken kan vara gammal eller felstavad.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn btn-dark">
          Till startsidan
        </Link>
        <Link href="/sortiment" className="btn btn-outline">
          Se sortimentet
        </Link>
      </div>
    </div>
  );
}
