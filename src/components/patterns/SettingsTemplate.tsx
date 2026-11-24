import { useState } from 'react';
import { CheckIcon, CopyIcon } from '../Icons';
import {
  Badge,
  ClipboardButton,
  ConfirmDialog,
  RadioGroup,
  SelectMenu,
  SpringSwitch,
  TactileButton,
  TextArea,
  TextField,
  useOptionalToast,
} from '../ui';

const REGION_OPTIONS = [
  { value: 'sin', label: 'AP Southeast (Singapore)', hint: '29 ms median' },
  { value: 'fra', label: 'EU Central (Frankfurt)', hint: '24 ms median' },
  { value: 'iad', label: 'US East (Virginia)', hint: '18 ms median' },
] as const;

const CHANNEL_OPTIONS = [
  { value: 'stable', label: 'Stable channel', description: 'Weekly verified runtime images.' },
  { value: 'canary', label: 'Canary channel', description: 'Daily builds with fast rollback.' },
] as const;

export function SettingsTemplate() {
  const [workspaceName, setWorkspaceName] = useState('Formwork Production');
  const [workspaceBio, setWorkspaceBio] = useState(
    'Edge observability cluster handling multi-region API telemetry.',
  );
  const [region, setRegion] = useState('sin');
  const [channel, setChannel] = useState<'stable' | 'canary'>('stable');
  const [digestAlerts, setDigestAlerts] = useState(true);
  const [strictAudit, setStrictAudit] = useState(true);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const toastApi = useOptionalToast();

  return (
    <div className="rounded-xl squircle-corners border border-(--color-border) bg-(--color-bg)">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--color-border) px-6 py-5">
        <div>
          <h3 className="m-0 text-[16px] font-medium text-(--color-fg)">Workspace settings</h3>
          <p className="m-0 mt-1 text-[13px] text-(--color-muted)">
            Two-column editorial form: labels stay calm on the left while controls stack cleanly on the right.
          </p>
        </div>
        <Badge variant="dot" tone="success" size="sm">
          Synced
        </Badge>
      </div>

      <div className="divide-y divide-(--color-border)">
        <section className="grid gap-4 px-6 py-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <h4 className="m-0 text-[14px] text-(--color-fg)">Workspace identity</h4>
            <p className="m-0 mt-1 text-[12px] text-(--color-muted)">
              Visible across audit trails and deployment notices.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:col-span-8">
            <TextField
              label="Workspace name"
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
            />
            <TextArea
              label="Operational summary"
              value={workspaceBio}
              maxLength={140}
              showCount
              onChange={(event) => setWorkspaceBio(event.target.value)}
              helperText="Included in status page headers."
            />
          </div>
        </section>

        <section className="grid gap-4 px-6 py-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <h4 className="m-0 text-[14px] text-(--color-fg)">Compute and rollout</h4>
            <p className="m-0 mt-1 text-[12px] text-(--color-muted)">
              Select default cluster placement and release cadence.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:col-span-8">
            <SelectMenu
              label="Primary cluster region"
              value={region}
              onValueChange={setRegion}
              options={REGION_OPTIONS}
            />
            <RadioGroup
              label="Release channel"
              value={channel}
              onValueChange={setChannel}
              layout="cards"
              options={CHANNEL_OPTIONS}
            />
          </div>
        </section>

        <section className="grid gap-4 px-6 py-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <h4 className="m-0 text-[14px] text-(--color-fg)">Security and notifications</h4>
            <p className="m-0 mt-1 text-[12px] text-(--color-muted)">
              Signing keys, audit enforcement, and incident alerts.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md squircle-corners border border-(--color-border) bg-(--color-surface) p-3.5">
              <div>
                <div className="text-[13px] text-(--color-fg)">CLI deploy token</div>
                <div className="mt-0.5 font-mono text-[12px] text-(--color-muted)">
                  fw_live_9821_readonly_demo
                </div>
              </div>
              <ClipboardButton
                text="fw_live_9821_readonly_demo"
                idleLabel="Copy token"
                copiedLabel="Copied token"
                variant="outline"
                size="sm"
                idleIcon={<CopyIcon />}
                copiedIcon={<CheckIcon />}
              />
            </div>

            <div className="flex flex-col gap-2">
              <SpringSwitch
                label="Send weekly SLA latency digests"
                checked={digestAlerts}
                onCheckedChange={setDigestAlerts}
              />
              <SpringSwitch
                label="Enforce strict Zod payload validation"
                checked={strictAudit}
                onCheckedChange={setStrictAudit}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--color-border) pt-4">
              <TactileButton variant="destructive" size="sm" onClick={() => setRevokeOpen(true)}>
                Revoke deploy token
              </TactileButton>
              <TactileButton
                variant="solid"
                size="sm"
                onClick={() =>
                  toastApi?.toast({
                    title: 'Settings saved',
                    description: `${workspaceName} pinned to ${region.toUpperCase()} (${channel}).`,
                    tone: 'success',
                  })
                }
              >
                Save preferences
              </TactileButton>
            </div>
          </div>
        </section>
      </div>

      <ConfirmDialog
        isOpen={revokeOpen}
        title="Revoke active deploy token?"
        description="Automated CI workflows using fw_live_9821 will fail immediately until a new token is issued."
        confirmLabel="Revoke token"
        cancelLabel="Keep token"
        destructive
        onCancel={() => setRevokeOpen(false)}
        onConfirm={() => {
          setRevokeOpen(false);
          toastApi?.toast({
            title: 'Token revoked',
            description: 'Issue a replacement key before the next CI deploy.',
            tone: 'warning',
          });
        }}
      />
    </div>
  );
}
