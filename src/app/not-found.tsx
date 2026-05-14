import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink-0 px-6 text-center">
      <div>
        <p className="eyebrow">/ 404</p>
        <h1 className="mt-3 font-display text-display-md tracking-tightest">
          Composable, but <span className="text-electric">not at this URL</span>.
        </h1>
        <p className="mt-3 text-mute">The page you’re looking for doesn’t exist.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 btn-electric"
        >
          ← Back to studio
        </Link>
      </div>
    </main>
  );
}
