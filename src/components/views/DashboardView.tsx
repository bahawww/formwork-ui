import { DashboardTemplate } from '../patterns/dashboard/DashboardTemplate';

export function DashboardView() {
  return (
    <div className="flex flex-col gap-6">
      <header className="border-b border-(--color-border) pb-5">
        <h1 className="m-0 text-[28px] font-semibold leading-tight tracking-tight text-(--color-fg)">
          Dashboard template
        </h1>
        <p className="m-0 mt-1.5 max-w-[68ch] text-[14px] text-(--color-muted)">
          Reference SaaS operations layout enforcing Macro-Meso-Micro hierarchy, asymmetric 12-column bento framing, hairline stat strips, and 5-state resilience.
        </p>
      </header>

      <DashboardTemplate />
    </div>
  );
}
