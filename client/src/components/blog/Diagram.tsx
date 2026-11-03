import { useId } from 'react';
import type { BlogInput } from '@portfolio/shared';

type DiagramElements = BlogInput['chapters'][number]['diagram'];
type Shape = NonNullable<DiagramElements>[number];

const PADDING = 24;
// Drawings are authored on Excalidraw's infinite canvas, so the viewBox is fitted to the content.
// Strokes get a mild bump from that fit so they stay visible when a wide drawing is zoomed out.
const REFERENCE_WIDTH = 720;
const LINE_HEIGHT_RATIO = 1.25;
const INK = '#24221f';
// Pre-colour-schema posts stored no paint values, so shapes fall back to the palette they shipped with.
const DEFAULT_FILL: Record<Shape['type'], string> = { rectangle: '#bde7ff', ellipse: '#f5df72', arrow: 'transparent', text: 'transparent' };

const boundsOf = (elements: Shape[]) => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const item of elements) {
    minX = Math.min(minX, item.x);
    minY = Math.min(minY, item.y);
    maxX = Math.max(maxX, item.x + item.width);
    maxY = Math.max(maxY, item.y + item.height);
  }
  return { minX, minY, maxX, maxY };
};

// Excalidraw stores a text block's height as lines x fontSize x 1.25, so the authored size is recoverable.
const fontOf = (item: Shape) => {
  const lines = Math.max(1, (item.text ?? '').split('\n').length);
  return Math.max(6, item.height / lines / LINE_HEIGHT_RATIO);
};

const toFill = (item: Shape) => {
  const color = item.backgroundColor ?? DEFAULT_FILL[item.type];
  return color === 'transparent' ? 'none' : color;
};
const toStroke = (item: Shape) => (item.strokeColor && item.strokeColor !== 'transparent' ? item.strokeColor : INK);

export function Diagram({ elements }: { elements: DiagramElements }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  if (!elements.length) return null;
  const { minX, minY, maxX, maxY } = boundsOf(elements);
  const width = Math.max(1, maxX - minX) + PADDING * 2;
  const height = Math.max(1, maxY - minY) + PADDING * 2;
  const stroke = 3 * Math.min(2, Math.max(1, width / REFERENCE_WIDTH / 1.5));
  // Arrow heads are painted per stroke colour because an SVG marker cannot inherit the line's colour.
  const arrowColors = [...new Set(elements.filter((item) => item.type === 'arrow').map(toStroke))];
  const markerFor = (color: string) => `arrow${uid}${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <figure className="my-8 overflow-hidden border-2 border-line bg-[#fcfbf7] p-3 shadow-brut-sm">
      <svg viewBox={`${minX - PADDING} ${minY - PADDING} ${width} ${height}`} className="mx-auto h-auto max-h-[70vh] w-full" role="img" aria-label="Project diagram">
        <defs>
          {arrowColors.map((color) => (
            <marker key={color} id={markerFor(color)} markerWidth={3 * stroke} markerHeight={3 * stroke} refX={2.7 * stroke} refY={1.5 * stroke} orient="auto" markerUnits="userSpaceOnUse">
              <path d={`M0,0 L0,${3 * stroke} L${2.7 * stroke},${1.5 * stroke} z`} fill={color} />
            </marker>
          ))}
        </defs>
        {elements.map((item) => item.type === 'arrow' ? (
          <line key={item.id} x1={item.x} y1={item.y} x2={item.x + item.width} y2={item.y + item.height} stroke={toStroke(item)} strokeWidth={stroke} markerEnd={`url(#${markerFor(toStroke(item))})`} />
        ) : item.type === 'text' ? (
          <Label key={item.id} item={item} anchor="start" />
        ) : item.type === 'ellipse' ? (
          <g key={item.id}>
            <ellipse cx={item.x + item.width / 2} cy={item.y + item.height / 2} rx={item.width / 2} ry={item.height / 2} fill={toFill(item)} stroke={toStroke(item)} strokeWidth={stroke} />
            {item.text ? <Label item={item} anchor="middle" center={{ x: item.x + item.width / 2, y: item.y + item.height / 2 }} /> : null}
          </g>
        ) : (
          <g key={item.id}>
            <rect x={item.x} y={item.y} width={item.width} height={item.height} fill={toFill(item)} stroke={toStroke(item)} strokeWidth={stroke} />
            {item.text ? <Label item={item} anchor="middle" center={{ x: item.x + item.width / 2, y: item.y + item.height / 2 }} /> : null}
          </g>
        ))}
      </svg>
    </figure>
  );
}

/** SVG text ignores newlines, so a wrapped Excalidraw label becomes one tspan per line. */
function Label({ item, anchor, center }: { item: Shape; anchor: 'middle' | 'start'; center?: { x: number; y: number } }) {
  const fontSize = fontOf(item);
  const lineHeight = fontSize * LINE_HEIGHT_RATIO;
  const lines = (item.text ?? '').split('\n');
  const x = center?.x ?? item.x;
  const top = center ? center.y - ((lines.length - 1) * lineHeight) / 2 : item.y + lineHeight / 2;
  return (
    <text fill={toStroke(item)} fontFamily="monospace" fontSize={fontSize} textAnchor={anchor} dominantBaseline="middle">
      {lines.map((line, i) => <tspan key={i} x={x} y={top + i * lineHeight}>{line}</tspan>)}
    </text>
  );
}
