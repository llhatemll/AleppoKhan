type InputFieldProps = {
  label: string;
  error?: string;
  required?: boolean;
} & (
  | ({ as?: "input" } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({ as: "textarea" } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
  | ({ as: "select"; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>)
);

export default function InputField({ label, error, required, as = "input", ...rest }: InputFieldProps) {
  const inputStyle: React.CSSProperties = {
    background: "var(--bg)",
    color: "var(--fg)",
    border: `1.5px solid ${error ? "#ef4444" : "var(--border)"}`,
    borderRadius: "8px",
    padding: "12px 16px",
    width: "100%",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
    boxShadow: error ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
  };

  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
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
      {error && (
        <span className="text-xs font-bold flex items-center gap-1" style={{ color: "#ef4444" }}>
          ⚠ {error}
        </span>
      )}
    </label>
  );
}
