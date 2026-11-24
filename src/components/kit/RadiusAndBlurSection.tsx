import { Badge, SurfaceCard, SurfaceCardBody, TactileButton } from '../ui';

const RADIUS_SCALE = [
  { token: 'xs', px: '6px', className: 'rounded-xs', usage: 'Inner tabs, checkboxes' },
  { token: 'sm', px: '8px', className: 'rounded-sm', usage: 'Tooltips, compact pills' },
  { token: 'md', px: '10px', className: 'rounded-md', usage: 'Buttons, inputs, switches' },
  { token: 'lg', px: '14px', className: 'rounded-lg', usage: 'Cards, menus, toasts' },
  { token: 'xl', px: '20px', className: 'rounded-xl', usage: 'Modals, login frames' },
] as const;

export function RadiusAndBlurSection() {
  return (
    <section className="flex flex-col gap-5" aria-label="Corner radius and frosted blur">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="m-0 text-[18px] font-title text-(--color-fg)">Concentric corners and frosted glass</h2>
          <p className="m-0 mt-1 max-w-[66ch] text-[13px] text-(--color-muted)">
            Nested radii follow R_inner = max(4px, R_outer - padding - border) so inner elements track outer frames with equal diagonal air.
          </p>
        </div>
        <span className="rounded-sm squircle-corners border border-(--color-border) bg-(--color-surface) px-2.5 py-1 font-mono text-[12px] text-(--color-fg) tabular">
          20px outer - 6px pad = 14px inner
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {RADIUS_SCALE.map((item) => (
          <div
            key={item.token}
            className="flex flex-col justify-between gap-2 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-3"
          >
            <div
              className={`h-11 w-full border border-(--color-border-strong) bg-(--color-bg) squircle-corners ${item.className}`}
            />
            <div>
              <div className="text-[13px] text-(--color-fg) tabular">
                {item.token} ({item.px})
              </div>
              <div className="text-[11px] text-(--color-muted)">{item.usage}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="kit-stripe-bg relative overflow-hidden rounded-xl squircle-corners border border-(--color-border) p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <SurfaceCard variant="glass" radius="lg">
            <SurfaceCardBody>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] text-(--color-fg)">Frosted surface (.glass-surface)</span>
                <Badge variant="glass" size="sm">
                  24px blur
                </Badge>
              </div>
              <p className="m-0 text-[13px] text-(--color-muted)">
                Uses 86% to 88% opaque tinted neutral fill so background gridlines soften without washing out contrast.
              </p>
            </SurfaceCardBody>
          </SurfaceCard>

          <div className="glass-bar flex flex-col justify-between gap-3 rounded-lg squircle-corners border p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[14px] text-(--color-fg)">Sticky header bar (.glass-bar)</span>
              <Badge variant="dot" tone="success" size="sm">
                16px blur
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <TactileButton variant="glass" size="sm">
                Glass button
              </TactileButton>
              <TactileButton variant="solid" size="sm">
                Primary action
              </TactileButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
