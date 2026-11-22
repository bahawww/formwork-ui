export interface SurfaceSkeletonProps {
  variant?: 'dashboard' | 'panel' | 'table';
}

export function SurfaceSkeleton({ variant = 'dashboard' }: SurfaceSkeletonProps) {
  if (variant === 'table') {
    return (
      <section
        className="flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-4"
        role="status"
        aria-busy="true"
        aria-label="Loading table rows"
      >
        <div className="skeleton-pulse h-9 w-56 rounded-md squircle-corners" />
        <div className="skeleton-pulse h-10 w-full rounded-sm squircle-corners" />
        <div className="skeleton-pulse h-10 w-full rounded-sm squircle-corners" />
        <div className="skeleton-pulse h-10 w-full rounded-sm squircle-corners" />
        <div className="skeleton-pulse h-10 w-5/6 rounded-sm squircle-corners" />
      </section>
    );
  }

  if (variant === 'panel') {
    return (
      <section
        className="flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-5"
        role="status"
        aria-busy="true"
        aria-label="Loading chart panel"
      >
        <div className="skeleton-pulse h-5 w-44 rounded-xs squircle-corners" />
        <div className="skeleton-pulse h-3.5 w-64 rounded-xs squircle-corners" />
        <div className="skeleton-pulse h-44 w-full rounded-md squircle-corners" />
      </section>
    );
  }

  return (
    <section
      className="flex flex-col gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading dashboard view"
    >
      <div className="grid grid-cols-1 border-y border-(--color-border) sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((cell) => (
          <div
            key={cell}
            className="flex flex-col gap-2 border-b border-(--color-border) p-4 sm:border-e lg:border-b-0 lg:last:border-e-0"
          >
            <div className="skeleton-pulse h-3 w-24 rounded-xs squircle-corners" />
            <div className="skeleton-pulse h-7 w-20 rounded-sm squircle-corners" />
            <div className="skeleton-pulse h-3 w-28 rounded-xs squircle-corners" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="skeleton-pulse h-64 rounded-lg squircle-corners lg:col-span-8" />
        <div className="skeleton-pulse h-64 rounded-lg squircle-corners lg:col-span-4" />
      </div>
    </section>
  );
}
