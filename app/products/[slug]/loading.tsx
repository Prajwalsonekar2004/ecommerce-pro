export default function Loading() {
  return (
    <main className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="animate-pulse">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="aspect-[3/4] rounded-3xl bg-neutral-200" />

          <div className="space-y-4">
            <div className="h-5 w-28 rounded bg-neutral-200" />
            <div className="h-10 w-80 rounded bg-neutral-200" />
            <div className="h-6 w-32 rounded bg-neutral-200" />

            <div className="mt-8 space-y-3">
              <div className="h-4 w-full rounded bg-neutral-200" />
              <div className="h-4 w-5/6 rounded bg-neutral-200" />
              <div className="h-4 w-4/6 rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
