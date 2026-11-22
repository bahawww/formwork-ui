import { CheckIcon, CopyIcon } from '../../Icons';
import { ClipboardButton, SlideOverDrawer, TactileButton } from '../../ui';
import type { DeploymentRecord } from './dashboardData';

export interface DeploymentInspectorDrawerProps {
  record: DeploymentRecord | null;
  onClose: () => void;
}

export function DeploymentInspectorDrawer({ record, onClose }: DeploymentInspectorDrawerProps) {
  return (
    <SlideOverDrawer
      isOpen={record !== null}
      onClose={onClose}
      title={record ? record.service : 'Deployment detail'}
      description={record ? `${record.region} updated ${record.updatedAt}` : undefined}
      footer={
        record ? (
          <>
            <ClipboardButton
              text={record.commit}
              idleLabel="Copy SHA"
              copiedLabel="Copied SHA"
              variant="outline"
              size="sm"
              idleIcon={<CopyIcon />}
              copiedIcon={<CheckIcon />}
            />
            <TactileButton variant="solid" size="sm" onClick={onClose}>
              Done
            </TactileButton>
          </>
        ) : null
      }
    >
      {record ? (
        <div className="flex flex-col gap-4 text-[13px]">
          <div className="grid grid-cols-2 gap-3 rounded-lg squircle-corners border border-(--color-border) bg-(--color-surface) p-3.5">
            <div>
              <div className="text-[11px] text-(--color-subtle)">State</div>
              <div className="mt-0.5 text-(--color-fg)">{record.status}</div>
            </div>
            <div>
              <div className="text-[11px] text-(--color-subtle)">Tail p95</div>
              <div className="mt-0.5 text-(--color-fg) tabular">{record.p95Ms} ms</div>
            </div>
            <div>
              <div className="text-[11px] text-(--color-subtle)">Commit</div>
              <div className="mt-0.5 font-mono text-[12px] text-(--color-fg)">{record.commit}</div>
            </div>
            <div>
              <div className="text-[11px] text-(--color-subtle)">Owner</div>
              <div className="mt-0.5 text-(--color-fg)">{record.owner}</div>
            </div>
          </div>
          <div>
            <div className="text-[12px] text-(--color-muted)">Release note</div>
            <p className="m-0 mt-1 text-(--color-fg)">{record.notes}</p>
          </div>
        </div>
      ) : null}
    </SlideOverDrawer>
  );
}
