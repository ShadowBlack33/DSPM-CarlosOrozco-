import type { ReactNode } from 'react';

const isEmpty = (v: unknown) => v === null || v === undefined || v === '';

export const Readouts = ({ items, three }: { items: [string, unknown][]; three?: boolean }) => (
  <dl className={`readouts${three ? ' three' : ''}`}>
    {items.map(([label, value]) => (
      <div className="readout" key={label}>
        <dt>{label}</dt>
        <dd className={isEmpty(value) ? 'is-empty' : ''}>{isEmpty(value) ? '—' : String(value)}</dd>
      </div>
    ))}
  </dl>
);

export const BigReading = ({ label, value, unit, extra }: { label: string; value: unknown; unit?: string; extra?: ReactNode }) => (
  <div className="big">
    <div className="big__label">{label}</div>
    <div className={`big__value${isEmpty(value) ? ' is-empty' : ''}`}>
      {isEmpty(value) ? '—' : String(value)}
      {!isEmpty(value) && unit && <small>{unit}</small>}
    </div>
    {extra}
  </div>
);
