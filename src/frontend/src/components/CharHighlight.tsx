interface CharHighlightProps {
  chars: string[];
  typed: string;
}

/**
 * Word-aware character highlight.
 * When user presses space to skip/finish a word, subsequent words
 * align correctly instead of being marked entirely wrong.
 */
export default function CharHighlight({ chars, typed }: CharHighlightProps) {
  const passage = chars.join("");

  // Build a mapping: passageCharIndex -> state
  // by aligning typed words against passage words
  const passageWords = passage.split(" ");
  const typedWords = typed.split(" ");

  // states array: 'correct' | 'wrong' | 'current' | 'untyped'
  type State = "correct" | "wrong" | "current" | "untyped";
  const states: State[] = new Array(passage.length).fill("untyped");

  // Whether user has finished typing a word (pressed space after it)
  // typedWords length > 1 means at least one space was pressed
  let passagePos = 0;

  for (let wi = 0; wi < passageWords.length; wi++) {
    const pw = passageWords[wi];
    const tw: string | undefined = typedWords[wi];
    const isLastTypedWord = wi === typedWords.length - 1;
    const wordIsComplete = !isLastTypedWord; // user pressed space after this word

    if (tw === undefined) {
      // Not typed yet
      passagePos += pw.length + (wi < passageWords.length - 1 ? 1 : 0);
      continue;
    }

    // Compare chars in this word
    for (let ci = 0; ci < pw.length; ci++) {
      const pi = passagePos + ci;
      if (ci < tw.length) {
        states[pi] = tw[ci] === pw[ci] ? "correct" : "wrong";
      } else if (!wordIsComplete && ci === tw.length) {
        // cursor is here
        states[pi] = "current";
      } else if (wordIsComplete) {
        // user skipped this character (pressed space before finishing word)
        states[pi] = "wrong";
      }
    }

    passagePos += pw.length;

    // Space between words
    if (wi < passageWords.length - 1) {
      const spaceIdx = passagePos;
      if (wordIsComplete) {
        states[spaceIdx] = "correct";
      } else if (tw.length === pw.length) {
        // typed word exactly, cursor is on space
        states[spaceIdx] = "current";
      }
      passagePos++;
    }
  }

  return (
    <>
      {chars.map((char, index) => {
        const state = states[index];
        let cls = "text-gray-400";
        if (state === "correct") cls = "text-green-700";
        else if (state === "wrong") cls = "text-red-600 bg-red-100 rounded";
        else if (state === "current")
          cls = "bg-yellow-300 text-gray-900 rounded";
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
