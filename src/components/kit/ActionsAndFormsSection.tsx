import { useState } from 'react';
import { CheckIcon, CopyIcon } from '../Icons';
import {
  ClipboardButton,
  Kbd,
  PasswordInput,
  RadioGroup,
  SearchInput,
  SegmentedControl,
  SelectMenu,
  SpringCheckbox,
  SpringSwitch,
  TactileButton,
  TactileSlider,
  TextArea,
  TextField,
  useOptionalToast,
} from '../ui';

const REGION_OPTIONS = [
  { value: 'sin', label: 'AP Southeast (Singapore)', hint: '29 ms median' },
  { value: 'fra', label: 'EU Central (Frankfurt)', hint: '24 ms median' },
  { value: 'iad', label: 'US East (Virginia)', hint: '18 ms median' },
] as const;

const MODE_OPTIONS = [
  { value: 'preview', label: 'Preview', description: 'Non-destructive dry run.' },
  { value: 'apply', label: 'Live rollout', description: 'Promotes immutable build tag.' },
] as const;

export function ActionsAndFormsSection() {
  const [slug, setSlug] = useState('telemetry-edge');
  const [filterText, setFilterText] = useState('');
  const [secret, setSecret] = useState('FormworkAuth!2026');
  const [notes, setNotes] = useState('Strict Zod boundary verification active.');
  const [region, setRegion] = useState('sin');
  const [envTab, setEnvTab] = useState<'dev' | 'staging' | 'prod'>('staging');
  const [rolloutMode, setRolloutMode] = useState<'preview' | 'apply'>('preview');
  const [concurrency, setConcurrency] = useState(40);
  const [streamOn, setStreamOn] = useState(true);
  const [strictGate, setStrictGate] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const toastApi = useOptionalToast();

  return (
    <section className="flex flex-col gap-5" aria-label="Actions and form controls">
      <div>
        <h2 className="m-0 text-[18px] font-medium text-(--color-fg)">Actions and form primitives</h2>
        <p className="m-0 mt-1 text-[13px] text-(--color-muted)">
          Monochrome CTAs with width-locked loading, 44px inputs, concentric segmented controls, and tactile springs.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <TactileButton
          variant="solid"
          size="md"
          loading={loadingBtn}
          loadingLabel="Deploying snapshot"
          onClick={() => {
            setLoadingBtn(true);
            window.setTimeout(() => {
              setLoadingBtn(false);
              toastApi?.toast({ title: 'Action verified', tone: 'success' });
            }, 500);
          }}
        >
          Trigger loading lock
        </TactileButton>
        <TactileButton variant="outline" size="md">
          Outline
        </TactileButton>
        <TactileButton variant="ghost" size="md">
          Ghost
        </TactileButton>
        <TactileButton variant="glass" size="md">
          Frosted glass
        </TactileButton>
        <ClipboardButton
          text="npm run check:rules && npm test"
          idleLabel="Copy command"
          copiedLabel="Copied command"
          variant="outline"
          size="md"
          idleIcon={<CopyIcon />}
          copiedIcon={<CheckIcon />}
        />
        <span className="inline-flex items-center gap-1.5 text-[12px] text-(--color-muted)">
          Shortcut <Kbd>Ctrl</Kbd> <Kbd>K</Kbd>
        </span>
      </div>

      <div className="grid gap-4 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-5 sm:grid-cols-2">
        <TextField
          label="Service slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          helperText="Lowercase letters, digits, and hyphens."
        />

        <SearchInput
          label="Filter inventory"
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
          onClear={() => setFilterText('')}
          shortcut="/"
        />

        <SelectMenu
          label="Primary cluster"
          value={region}
          onValueChange={setRegion}
          options={REGION_OPTIONS}
        />

        <PasswordInput
          label="Signing secret"
          value={secret}
          onChange={(event) => setSecret(event.target.value)}
          showStrength
        />

        <TextArea
          label="Release notes"
          value={notes}
          maxLength={120}
          showCount
          onChange={(event) => setNotes(event.target.value)}
        />

        <div className="flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-(--color-fg)">Environment rail</span>
            <SegmentedControl
              ariaLabel="Environment target"
              size="md"
              value={envTab}
              onValueChange={setEnvTab}
              options={[
                { value: 'dev', label: 'Development' },
                { value: 'staging', label: 'Staging' },
                { value: 'prod', label: 'Production' },
              ]}
            />
          </div>

          <TactileSlider
            label="Worker concurrency"
            min={10}
            max={100}
            step={5}
            value={concurrency}
            displayValue={`${concurrency} pods`}
            onChange={setConcurrency}
          />

          <SpringSwitch
            label="Stream edge telemetry"
            checked={streamOn}
            onCheckedChange={setStreamOn}
          />
        </div>
      </div>

      <RadioGroup
        label="Rollout policy"
        value={rolloutMode}
        onValueChange={setRolloutMode}
        layout="cards"
        options={MODE_OPTIONS}
      />

      <SpringCheckbox
        checked={strictGate}
        onCheckedChange={setStrictGate}
        label="Enforce concentric corner tokens and regular font weight on export"
        meta="System rule"
      />
    </section>
  );
}
