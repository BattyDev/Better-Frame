// Lightweight inline markdown renderer for comments.
// Supports: **bold**, *italic*, `code`, [link](url), and line breaks.
// No external dependencies — we keep the bundle small.

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(text: string): string {
  let html = escapeHtml(text);

  // `inline code`
  html = html.replace(/`([^`]+?)`/g, '<code class="px-1 py-0.5 bg-wf-bg rounded text-xs font-mono text-wf-text">$1</code>');

  // **bold**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-wf-text">$1</strong>');

  // *italic*
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // [link text](url) — only allow http/https URLs
  html = html.replace(
    /\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-wf-blue hover:underline">$1</a>',
  );

  // Line breaks
  html = html.replace(/\n/g, '<br />');

  return html;
}

interface MarkdownProps {
  text: string;
  className?: string;
}

export function Markdown({ text, className = '' }: MarkdownProps) {
  const html = renderInline(text);
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
