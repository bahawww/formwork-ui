import { useCallback, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { springs } from '../../lib/motionTokens';
import { playHoverSound } from '../../lib/sound';
import { TrashIcon } from '../Icons';

export interface ProximityListItem {
  id: string;
  label: string;
  isActive?: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
}

export interface ProximityListProps {
  items: ProximityListItem[];
}

export function ProximityList({ items }: ProximityListProps) {
  const containerRef = useRef<HTMLUListElement | null>(null);
  const itemElsRef = useRef<Map<number, HTMLLIElement>>(new Map());
  const reduceMotion = useReducedMotion();

  const springOpts = reduceMotion ? { duration: 0 } : springs.settle;
  const rawY = useMotionValue(0);
  const rawHeight = useMotionValue(38);
  const rawOpacity = useMotionValue(0);

  const highlightY = useSpring(rawY, springOpts);
  const highlightHeight = useSpring(rawHeight, springOpts);
  const highlightOpacity = useSpring(rawOpacity, springOpts);

  const moveHighlight = useCallback(
    (index: number | null) => {
      if (index === null) {
        if (reduceMotion) rawOpacity.jump(0);
        else rawOpacity.set(0);
        return;
      }
      const el = itemElsRef.current.get(index);
      if (!el) return;
      if (reduceMotion) {
        rawY.jump(el.offsetTop);
        rawHeight.jump(el.offsetHeight);
        rawOpacity.jump(1);
      } else {
        rawY.set(el.offsetTop);
        rawHeight.set(el.offsetHeight);
        rawOpacity.set(1);
      }
    },
    [reduceMotion, rawY, rawHeight, rawOpacity],
  );

  return (
    <ul
      ref={containerRef}
      className="nx-proximity-list"
      onMouseLeave={() => moveHighlight(null)}
    >
      <motion.div
        aria-hidden="true"
        className="nx-proximity-pill squircle-corners"
        style={{
          y: highlightY,
          height: highlightHeight,
          opacity: highlightOpacity,
        }}
      />
      {items.map((item, idx) => (
        <li
          key={item.id}
          ref={(node) => {
            if (node) itemElsRef.current.set(idx, node);
            else itemElsRef.current.delete(idx);
          }}
          className="nx-proximity-row"
          onMouseEnter={() => {
            playHoverSound();
            moveHighlight(idx);
          }}
          onFocus={() => moveHighlight(idx)}
        >
          <button
            type="button"
            className={item.isActive ? 'nx-proximity-btn is-active' : 'nx-proximity-btn'}
            aria-current={item.isActive ? 'true' : undefined}
            onClick={item.onSelect}
          >
            <span className="truncate">{item.label}</span>
          </button>
          {item.onDelete ? (
            <button
              type="button"
              className="nx-proximity-delete squircle-corners"
              aria-label={item.deleteLabel ?? `Remove ${item.label}`}
              onClick={item.onDelete}
            >
              <TrashIcon />
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
