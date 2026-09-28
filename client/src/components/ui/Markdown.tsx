import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '../../lib/cn';

/** Renders author-written Markdown with the `.prose-press` styles from globals.css. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('prose-press', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
