import { useState } from 'react';
import { AnimationMotionRules } from '../rules/AnimationMotionRules';
import { ColorHarmonyRules } from '../rules/ColorHarmonyRules';
import { GraphAntiSlopRules } from '../rules/GraphAntiSlopRules';
import { LayoutDashboardRules } from '../rules/LayoutDashboardRules';
import { SpacingCornerRules } from '../rules/SpacingCornerRules';
import { TabsSubtle } from '../ui';

type RuleDomain = 'color' | 'spacing' | 'layout' | 'motion' | 'graphs';

const RULE_TABS = [
  { value: 'color', label: 'Color & Harmony' },
  { value: 'spacing', label: 'Spacing & Corners' },
  { value: 'layout', label: 'Dashboard Layout' },
  { value: 'motion', label: 'Animation & Motion' },
  { value: 'graphs', label: 'Anti-Slop Graphs' },
] as const;

export function DesignRulesView() {
  const [domain, setDomain] = useState<RuleDomain>('color');

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 border-b border-(--color-border) pb-5">
        <div>
          <h1 className="m-0 text-[28px] font-figure leading-tight tracking-tight text-(--color-fg)">
            Design rules &amp; token lab
          </h1>
          <p className="m-0 mt-1.5 max-w-[68ch] text-[14px] text-(--color-muted)">
            Live engineering constraints codified into tokens, concentric geometry math, dashboard layout tiers, spring physics, and graph rules.
          </p>
        </div>

        <div>
          <TabsSubtle
            size="md"
            ariaLabel="Design rule category"
            value={domain}
            onValueChange={(next) => {
              if (
                next === 'color' ||
                next === 'spacing' ||
                next === 'layout' ||
                next === 'motion' ||
                next === 'graphs'
              ) {
                setDomain(next);
              }
            }}
            items={[...RULE_TABS]}
          />
        </div>
      </header>

      {domain === 'color' ? <ColorHarmonyRules /> : null}
      {domain === 'spacing' ? <SpacingCornerRules /> : null}
      {domain === 'layout' ? <LayoutDashboardRules /> : null}
      {domain === 'motion' ? <AnimationMotionRules /> : null}
      {domain === 'graphs' ? <GraphAntiSlopRules /> : null}
    </div>
  );
}
