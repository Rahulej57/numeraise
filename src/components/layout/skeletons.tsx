/**
 * Loading skeletons.
 *
 * The App Router renders nothing at all during navigation unless a segment
 * provides a loading.tsx. With none defined, tapping a calculator link produced
 * one to three seconds of a completely unchanged screen on mobile — no spinner,
 * no progress, no visual acknowledgement that the tap registered. Users
 * reasonably conclude the link is broken and leave.
 *
 * These skeletons mirror the real layout closely enough that the transition
 * reads as the page filling in rather than a flash of unrelated boxes.
 */

function Bar({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

/** Matches the two-column calculator layout: inputs left, results right. */
export function CalculatorSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl" aria-hidden="true">
      <Bar className="h-9 w-64 mb-2" />
      <Bar className="h-4 w-96 max-w-full mb-8" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl bg-muted/20 p-5 md:p-6 space-y-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Bar className="h-4 w-40" />
                  <Bar className="h-8 w-24" />
                </div>
                <Bar className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-xl bg-muted/40 p-5 md:p-6 space-y-6">
            <Bar className="h-6 w-48" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <Bar key={i} className="h-20" />
              ))}
            </div>
            <Bar className="h-9 w-full" />
            <Bar className="h-[280px] w-full" />
          </div>
        </div>
      </div>

      <div className="mt-16 space-y-4 max-w-3xl">
        <Bar className="h-7 w-72" />
        {[0, 1, 2, 3, 4].map((i) => (
          <Bar key={i} className={`h-4 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>

      <span className="sr-only" role="status">
        Loading calculator
      </span>
    </div>
  );
}

/** Generic article/listing skeleton for non-calculator routes. */
export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl" aria-hidden="true">
      <Bar className="h-10 w-3/4 mb-4" />
      <Bar className="h-5 w-1/2 mb-10" />
      <div className="space-y-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Bar key={i} className={`h-4 ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        {[0, 1, 2, 3].map((i) => (
          <Bar key={i} className="h-32" />
        ))}
      </div>
      <span className="sr-only" role="status">
        Loading page
      </span>
    </div>
  );
}

/** Placeholder occupying the exact chart height so nothing shifts on load. */
export function ChartSkeleton() {
  return (
    <div
      className="flex h-[350px] w-full items-end gap-2 rounded-lg bg-muted/30 p-4"
      aria-hidden="true"
    >
      {[45, 60, 40, 75, 55, 85, 65, 95, 70, 100].map((h, i) => (
        <div
          key={i}
          className="flex-1 animate-pulse rounded-t bg-muted"
          style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}
