interface CharHighlightProps {
  chars: string[];
  typed: string;
}

type CharItem = { char: string; id: number };

export default function CharHighlight({ chars, typed }: CharHighlightProps) {
  const items: CharItem[] = [];
  for (let index = 0; index < chars.length; index++) {
    items.push({ char: chars[index], id: index });
  }

  return (
    <>
      {items.map((item) => {
        let cls = "text-gray-500";
        if (item.id < typed.length) {
          cls =
            typed[item.id] === item.char
              ? "text-green-600 bg-green-50"
              : "text-red-600 bg-red-100";
        } else if (item.id === typed.length) {
          cls = "border-l-2 border-blue-500 text-gray-500";
        }
        return (
          <span key={item.id} className={cls}>
            {item.char}
          </span>
        );
      })}
    </>
  );
}
