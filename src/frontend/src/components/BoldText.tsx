interface BoldTextProps {
  text: string;
  className?: string;
}

/**
 * Renders text with **word** markers as <strong> elements.
 */
export default function BoldText({ text, className }: BoldTextProps) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const key = `bp-${i}`;
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={key}>{part.slice(2, -2)}</strong>;
        }
        return <span key={key}>{part}</span>;
      })}
    </span>
  );
}

/**
 * Returns plain text without ** markers.
 */
export function stripBold(text: string): string {
  return text.replace(/\*\*/g, "");
}
