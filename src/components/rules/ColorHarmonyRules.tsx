import { cn } from '../../lib/cn';
import { ACCENT_PRESETS, setAccentPreset, useAccentPreset } from '../../lib/accentTheme';
import { Badge, useOptionalToast } from '../ui';

const PRESET_SWATCH_CLASS: Record<string, string> = {
  '--color-preset-indigo': 'bg-(--color-preset-indigo)',
  '--color-preset-cobalt': 'bg-(--color-preset-cobalt)',
  '--color-preset-teal': 'bg-(--color-preset-teal)',
  '--color-preset-emerald': 'bg-(--color-preset-emerald)',
  '--color-preset-amber': 'bg-(--color-preset-amber)',
};

const HARMONY_SWATCHES = [
  { label: 'Analogous (-32 deg)', role: 'Secondary hover & chart pairing', bg: 'bg-(--color-harmony-analog-prev)' },
  { label: 'Primary Accent (H)', role: 'Focus rings, selection, active handle', bg: 'bg-(--color-accent)' },
  { label: 'Analogous (+32 deg)', role: 'Adjacent calm accent trend', bg: 'bg-(--color-harmony-analog-next)' },
  { label: 'Split Comp (+150 deg)', role: 'Balanced contrast category', bg: 'bg-(--color-harmony-split-a)' },
  { label: 'Split Comp (+210 deg)', role: 'Divergent comparison series', bg: 'bg-(--color-harmony-split-b)' },
  { label: 'Complementary (+180 deg)', role: 'Peak focal callout', bg: 'bg-(--color-harmony-comp)' },
] as const;

const TOKEN_PAIRS = [
  { token: '--color-bg', light: 'L 0.985, C 0.003, H 264', dark: 'L 0.145, C 0.006, H 264', role: 'Canvas ground (never pure black)' },
  { token: '--color-surface', light: 'L 0.968, C 0.004, H 264', dark: 'L 0.185, C 0.007, H 264', role: 'Wells & elevated panel step' },
  { token: '--color-fg', light: 'L 0.205, C 0.008, H 264', dark: 'L 0.955, C 0.004, H 264', role: 'Primary ink (Delta L >= 0.78)' },
  { token: '--color-muted', light: 'L 0.470, C 0.008, H 264', dark: 'L 0.720, C 0.008, H 264', role: 'Secondary copy (Delta L >= 0.51)' },
  { token: '--color-accent', light: 'L 0.540, C 0.160, H var', dark: 'L 0.720, C 0.130, H var', role: 'Single hue focal signal' },
] as const;

export function ColorHarmonyRules() {
  const activePreset = useAccentPreset();
  const toastApi = useOptionalToast();

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="m-0 text-[16px] font-title text-(--color-fg)">
              Interactive OKLCH accent harmony (H = {activePreset.hue} deg)
            </h2>
            <p className="m-0 mt-1 max-w-[66ch] text-[13px] text-(--color-muted)">
              Click any preset to update --accent-hue live across the entire interface. Equal lightness L guarantees consistent visual weight when switching hues.
            </p>
          </div>
          <Badge variant="dot" tone="accent" size="sm">
            {activePreset.label}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {ACCENT_PRESETS.map((preset) => {
            const selected = preset.id === activePreset.id;
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setAccentPreset(preset.id);
                  toastApi?.toast({
                    title: `Accent set to ${preset.label}`,
                    description: preset.note,
                  });
                }}
                className={cn(
                  'flex items-center gap-3 rounded-md squircle-corners border px-3 py-2.5 text-start cursor-pointer',
                  'transition-[border-color,background-color] duration-(--motion-dur-fast)',
                  selected
                    ? 'border-(--color-accent) bg-(--color-surface-accent)'
                    : 'border-(--color-border) bg-(--color-surface) hover:border-(--color-border-strong)',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-5 shrink-0 squircle border border-(--color-border)',
                    PRESET_SWATCH_CLASS[preset.swatchVar] ?? 'bg-(--color-accent)',
                  )}
                />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] text-(--color-fg)">{preset.label}</span>
                  <span className="block truncate text-[11px] text-(--color-muted)">{preset.note}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {HARMONY_SWATCHES.map((swatch) => (
            <div
              key={swatch.label}
              className="flex items-center gap-3 rounded-md squircle-corners border border-(--color-border) bg-(--color-surface) p-3"
            >
              <span aria-hidden="true" className={cn('size-8 shrink-0 rounded-sm squircle-corners', swatch.bg)} />
              <div className="min-w-0">
                <div className="truncate text-[13px] text-(--color-fg)">{swatch.label}</div>
                <div className="truncate text-[11px] text-(--color-muted)">{swatch.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-bg) p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="m-0 text-[15px] font-title text-(--color-fg)">60-30-10 color budget</h3>
          <span className="text-[12px] text-(--color-muted)">Never let accents flood structural surfaces</span>
        </div>

        <div className="flex h-4 w-full overflow-hidden rounded-sm squircle-corners border border-(--color-border)">
          <div className="h-full bg-(--color-surface)" style={{ width: '60%' }} title="60% tinted neutral grounds" />
          <div className="h-full bg-(--color-border-strong)" style={{ width: '30%' }} title="30% ink & hairlines" />
          <div className="h-full bg-(--color-accent)" style={{ width: '10%' }} title="10% accent focus & active states" />
        </div>

        <div className="grid gap-2 text-[12px] text-(--color-muted) sm:grid-cols-3">
          <div>60% Neutral canvas & wells (--color-bg, --color-surface)</div>
          <div>30% Neutral ink & hairline borders (--color-fg, --color-border)</div>
          <div>10% Intentional accent & semantic feedback (--color-accent)</div>
        </div>
      </section>

      <div className="overflow-x-auto rounded-lg squircle-corners border border-(--color-border)">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-surface)">
              <th className="px-4 py-3 text-start font-body text-(--color-muted)">Token</th>
              <th className="px-4 py-3 text-start font-body text-(--color-muted)">Light (:root)</th>
              <th className="px-4 py-3 text-start font-body text-(--color-muted)">Dark (.dark)</th>
              <th className="px-4 py-3 text-start font-body text-(--color-muted)">Contrast & role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {TOKEN_PAIRS.map((row) => (
              <tr key={row.token}>
                <td className="px-4 py-3 font-mono text-[12px] text-(--color-fg)">{row.token}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-(--color-muted)">{row.light}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-(--color-muted)">{row.dark}</td>
                <td className="px-4 py-3 text-(--color-fg)">{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
