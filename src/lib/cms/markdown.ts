/** Convert n8n markdown body → HTML for the rich-text editor. */
export function markdownToHtml(md: string): string {
  if (!md || typeof md !== "string") return "";
  if (/^\s*<[a-zA-Z]/.test(md)) return md;

  let html = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(
    /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
    "<em>$1</em>",
  );

  html = html.replace(/((?:^[-*+] .+\n?)+)/gm, (match: string) => {
    const items = match
      .trim()
      .split("\n")
      .filter((l: string) => l.trim())
      .map((l: string) => `<li>${l.replace(/^[-*+]\s+/, "").trim()}</li>`)
      .join("");
    return `<ul>${items}</ul>\n`;
  });

  html = html.replace(/((?:^\d+\.\s.+\n?)+)/gm, (match: string) => {
    const items = match
      .trim()
      .split("\n")
      .filter((l: string) => l.trim())
      .map((l: string) => `<li>${l.replace(/^\d+\.\s+/, "").trim()}</li>`)
      .join("");
    return `<ol>${items}</ol>\n`;
  });

  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/^---+$/gm, "<hr>");

  const blocks = html.split(/\n\n+/);
  html = blocks
    .map((block: string) => {
      block = block.trim();
      if (!block) return "";
      if (/^<(h[1-6]|ul|ol|blockquote|hr|div|p)/.test(block)) return block;
      block = block.replace(/\n/g, "<br>");
      return `<p>${block}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return html;
}
