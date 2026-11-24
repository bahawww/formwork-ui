import { useState } from 'react';
import { ActionsAndFormsSection } from './kit/ActionsAndFormsSection';
import { DataAndFeedbackSection } from './kit/DataAndFeedbackSection';
import { NavigationAndOverlaysSection } from './kit/NavigationAndOverlaysSection';
import { PagePatternsSection } from './kit/PagePatternsSection';
import { RadiusAndBlurSection } from './kit/RadiusAndBlurSection';
import { TabsSubtle } from './ui';

type KitCategory = 'all' | 'foundations' | 'forms' | 'overlays' | 'data' | 'patterns';

const KIT_CATEGORIES = [
  { value: 'all', label: 'All (34)' },
  { value: 'foundations', label: 'Radii & Blur' },
  { value: 'forms', label: 'Actions & Forms' },
  { value: 'overlays', label: 'Overlays & Nav' },
  { value: 'data', label: 'Data & Feedback' },
  { value: 'patterns', label: 'Page Patterns' },
] as const;

export function ComponentKitShowcase() {
  const [category, setCategory] = useState<KitCategory>('all');

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3 border-b border-(--color-border) pb-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="m-0 text-[28px] font-semibold leading-tight tracking-tight text-(--color-fg)">
              Reusable UI kit
            </h1>
            <p className="m-0 mt-1.5 max-w-[68ch] text-[14px] text-(--color-muted)">
              34 Tailwind v4 primitives, concentric radii, frosted glass layers, and full-page patterns ready to drop into any product.
            </p>
          </div>
          <TabsSubtle
            size="sm"
            ariaLabel="Kit category"
            value={category}
            onValueChange={(next) => {
              if (
                next === 'all' ||
                next === 'foundations' ||
                next === 'forms' ||
                next === 'overlays' ||
                next === 'data' ||
                next === 'patterns'
              ) {
                setCategory(next);
              }
            }}
            items={[...KIT_CATEGORIES]}
          />
        </div>
      </header>

      {category === 'all' || category === 'foundations' ? <RadiusAndBlurSection /> : null}
      {category === 'all' || category === 'forms' ? <ActionsAndFormsSection /> : null}
      {category === 'all' || category === 'overlays' ? <NavigationAndOverlaysSection /> : null}
      {category === 'all' || category === 'data' ? <DataAndFeedbackSection /> : null}
      {category === 'all' || category === 'patterns' ? <PagePatternsSection /> : null}
    </div>
  );
}
