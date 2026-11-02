export default function StarRating({ value = 0, onChange, disabled = false, size = 28 }) {
  return (
    <div role="radiogroup" aria-label="Rating" style={{ display: 'inline-flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          disabled={disabled}
          onClick={() => onChange?.(n)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            lineHeight: 1,
            fontSize: size,
            cursor: disabled ? 'default' : 'pointer',
            color: n <= value ? '#f59e0b' : 'rgba(128,128,128,0.45)',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}