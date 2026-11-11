import React from "react";

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-muted px-1 py-0.5 text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function JobDescription({ markdown }: { markdown: string }) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="my-3 list-disc space-y-1 pl-5">
        {list.map((item, index) => (
          <li key={index}>{renderInline(item)}</li>
        ))}
      </ul>
    );
    list = [];
  };

  markdown.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trimEnd();
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    const bullet = line.match(/^[-*]\s+(.*)$/);

    if (bullet) {
      list.push(bullet[1]);
      return;
    }

    flushList();

    if (!line.trim()) return;

    if (heading) {
      const level = heading[1].length;
      const className =
        level <= 2
          ? "mt-5 mb-2 text-lg font-bold"
          : "mt-4 mb-1.5 text-base font-semibold";
      blocks.push(
        <h3
          key={index}
          className={className}
        >
          {renderInline(heading[2])}
        </h3>
      );
      return;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      blocks.push(<hr key={index} className="my-4" />);
      return;
    }

    blocks.push(
      <p key={index} className="mb-2 leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });

  flushList();

  return <div className="text-[15px] text-foreground/90">{blocks}</div>;
}
