import type { BlogInput } from '@portfolio/shared';
export function Diagram({ elements }: { elements: BlogInput['chapters'][number]['diagram'] }) {
  if (!elements.length) return null;
  return <div className="my-8 overflow-hidden border-2 border-line bg-[#fcfbf7] p-3 shadow-brut-sm"><svg viewBox="0 0 800 440" className="h-auto w-full" aria-label="Project diagram">
    <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#24221f" /></marker></defs>
    {elements.map((item) => item.type === 'arrow' ? <line key={item.id} x1={item.x} y1={item.y} x2={item.x + item.width} y2={item.y + item.height} stroke="#24221f" strokeWidth="3" markerEnd="url(#arrow)" /> : item.type === 'ellipse' ? <ellipse key={item.id} cx={item.x + item.width / 2} cy={item.y + item.height / 2} rx={item.width / 2} ry={item.height / 2} fill="#f5df72" stroke="#24221f" strokeWidth="3" /> : <g key={item.id}><rect x={item.x} y={item.y} width={item.width} height={item.height} fill={item.type === 'text' ? 'none' : '#bde7ff'} stroke={item.type === 'text' ? 'none' : '#24221f'} strokeWidth="3" /><text x={item.x + 12} y={item.y + 28} fill="#24221f" fontFamily="monospace" fontSize="18">{item.text}</text></g>)}
  </svg></div>;
}
