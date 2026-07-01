type InputFieldProps = {
  label: string;
  error?: string;
  required?: boolean;
} & (
  | ({ as?: "input" } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({ as: "textarea" } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
  | ({ as: "select"; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>)
);

const inputStyle = {
  background: "var(--bg)",
  color: "var(--fg)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  padding: "12px 16px",
  width: "100%",
  outline: "none",
  fontFamily: "var(--font-cairo)",
};

export default function InputField({ label, error, required, as = "input", ...rest }: InputFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>
        {label} {required && <span style={{ color: "var(--accent)" }}>*</span>}
      </span>
      {as === "textarea" ? (
        <textarea style={inputStyle} {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : as === "select" ? (
        <select style={inputStyle} {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}>
          {(rest as { children?: React.ReactNode }).children}
        </select>
      ) : (
        <input style={inputStyle} {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error && <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{error}</span>}
    </label>
  );
}
