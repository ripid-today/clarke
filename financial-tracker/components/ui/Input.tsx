import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export default function Input({
  label,
  error,
  required,
  id,
  className,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-claude-secondary"
        >
          {label}
          {required && <span className="text-red-600 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full rounded-lg border border-claude-secondary bg-white px-3 py-2 text-[15px] text-black placeholder:text-claude-secondary',
          'focus:outline-none focus:ring-2 focus:ring-claude-primary focus:ring-offset-2 focus:border-claude-primary',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
