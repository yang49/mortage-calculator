import React from 'react';

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: number | undefined;
  onChange: (value: number) => void;
  allowDecimals?: boolean;
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

export default function MoneyInput({ value, onChange, allowDecimals = true, onBlur, ...rest }: MoneyInputProps) {
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
    setText(Number.isFinite(num) ? formatNumberString(num, allowDecimals) : '');
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
