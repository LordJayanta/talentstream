const RESPONSIBILITY_HEADING =
  /responsibilit|what you(?:'|’| wi)ll do|you will|key tasks|day[- ]to[- ]day|your role/i;

export interface ParsedJobDescription {
  about: string;
  responsibilities: string[];
}

/**
 * Splits an employer's markdown description into prose for "About the Role"
 * and bullet items for "Key Responsibilities", so the job page does not show
 * the same list twice.
 */
export function parseJobDescription(markdown: string): ParsedJobDescription {
  const sections: { heading?: string; lines: string[] }[] = [{ lines: [] }];

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    const heading = line.match(/^#{1,6}\s+(.+)$/);
    if (heading) {
      sections.push({ heading: heading[1].trim(), lines: [] });
    } else {
      sections[sections.length - 1].lines.push(line);
    }
  }

  const about: string[] = [];
  const responsibilities: string[] = [];

  for (const section of sections) {
    const bullets: string[] = [];
    const prose: string[] = [];

    for (const line of section.lines) {
      const bullet = line.match(/^\s*[-*]\s+(.+)$/);
      if (bullet) bullets.push(bullet[1].trim());
      else if (line.trim()) prose.push(line);
    }

    if (section.heading && bullets.length > 0 && RESPONSIBILITY_HEADING.test(section.heading)) {
      responsibilities.push(...bullets);
      if (prose.length > 0) about.push(`## ${section.heading}`, ...prose);
      continue;
    }

    if (section.heading) about.push(`## ${section.heading}`);
    about.push(...section.lines);
  }

  return {
    about: about.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
    responsibilities,
  };
}
