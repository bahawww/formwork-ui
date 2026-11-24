import { LoginPage } from '../patterns/LoginPage';
import { SettingsTemplate } from '../patterns/SettingsTemplate';

export function PagePatternsSection() {
  return (
    <section className="flex flex-col gap-6" aria-label="Full page patterns">
      <div>
        <h2 className="m-0 text-[18px] font-medium text-(--color-fg)">Reusable full-page patterns</h2>
        <p className="m-0 mt-1 max-w-[66ch] text-[13px] text-(--color-muted)">
          Drop-in authentication and workspace settings templates built entirely from Formwork primitives.
        </p>
      </div>

      <LoginPage
        onAuthenticate={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 350));
        }}
      />

      <SettingsTemplate />
    </section>
  );
}
