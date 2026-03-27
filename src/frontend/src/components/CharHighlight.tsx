interface CharHighlightProps {
  chars: string[];
  typed: string;
}

export default function CharHighlight({ chars, typed }: CharHighlightProps) {
  return (
    <>
      {chars.map((char, index) => {
        let cls = "text-gray-400";
        if (index < typed.length) {
          cls =
            typed[index] === char
              ? "text-green-700"
              : "text-red-600 bg-red-100 rounded";
        } else if (index === typed.length) {
          cls = "bg-yellow-300 text-gray-900 rounded";
        }
        const key = `c-${index}`;
        return (
          <span key={key} className={cls}>
            {char}
          </span>
        );
      })}
    </>
  );
}
