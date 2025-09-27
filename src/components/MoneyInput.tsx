import React from 'react';

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: number | undefined;
  onChange: (value: number) => void;
  allowDecimals?: boolean;
  onCommit?: (value: number) => void; // fired on blur with finalized numeric value
}

function formatNumberString(n: number, allowDecimals: boolean) {
  if (!Number.isFinite(n)) return '';
  if (allowDecimals) {
    const [int, frac = ''] = Math.abs(n).toString().split('.');
    const intFmt = Number(int).toLocaleString();
    return frac ? `${intFmt}.${frac}` : intFmt;
  }
  return Math.floor(Math.abs(n)).toLocaleString();
}

export default function MoneyInput({ value, onChange, allowDecimals = true, onBlur, onCommit, ...rest }: MoneyInputProps) {
  const [text, setText] = React.useState<string>(value != null ? formatNumberString(value, allowDecimals) : '');

  React.useEffect(() => {
    setText(value != null ? formatNumberString(value, allowDecimals) : '');
  }, [value, allowDecimals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    // Allow digits, comma thousands separators, optional one dot
    raw = raw.replace(/[^0-9.,]/g, '');
    // If more than one dot, keep only first
    const firstDot = raw.indexOf('.');
    if (firstDot !== -1) {
      raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/[.]/g, '');
    }
    setText(raw);
    const numeric = Number(raw.replace(/,/g, ''));
    onChange(Number.isFinite(numeric) ? numeric : 0);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const num = Number(text.replace(/,/g, ''));
    const safeNum = Number.isFinite(num) ? num : 0;
    setText(Number.isFinite(num) ? formatNumberString(safeNum, allowDecimals) : '');
    onCommit?.(safeNum);
    onBlur?.(e);
  };

  return (
    <input
      type="text"
      inputMode={allowDecimals ? 'decimal' : 'numeric'}
      pattern={allowDecimals ? "[0-9,.]*" : "[0-9,]*"}
      value={text}
      onChange={handleChange}
      onBlur={handleBlur}
      {...rest}
    />
  );
}
