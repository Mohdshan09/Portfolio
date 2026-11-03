import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { BlogInput } from '@portfolio/shared';
import { useMemo, useRef, useState } from 'react';
import { Diagram } from './Diagram';

type DiagramElements = NonNullable<BlogInput['chapters'][number]['diagram']>;
type Stored = NonNullable<DiagramElements[number]>;
type SceneElement = {
  id: string; type: string; x: number; y: number; width: number; height: number; isDeleted: boolean;
  text?: string; backgroundColor?: string; strokeColor?: string;
};

const SHAPES: { type: Stored['type']; label: string; frame: { x: number; y: number; width: number; height: number } }[] = [
  { type: 'rectangle', label: 'Box', frame: { x: 80, y: 120, width: 220, height: 110 } },
  { type: 'ellipse', label: 'Oval', frame: { x: 380, y: 120, width: 220, height: 110 } },
  { type: 'arrow', label: 'Arrow', frame: { x: 120, y: 300, width: 240, height: 20 } },
  { type: 'text', label: 'Label', frame: { x: 120, y: 60, width: 240, height: 40 } },
];

const SUPPORTED: Stored['type'][] = ['rectangle', 'ellipse', 'arrow', 'text'];
const isSupported = (item: Stored) => SUPPORTED.includes(item.type);

// Mirrors the shared schema whitelist; anything else is dropped rather than echoed into SVG paint attributes.
const PAINT = /^(#[0-9a-f]{3,8}|transparent)$/i;
const paint = (value: string | undefined) => (value && PAINT.test(value) ? value : undefined);
const DEFAULT_FILL: Record<Stored['type'], string> = { rectangle: '#bde7ff', ellipse: '#f5df72', arrow: 'transparent', text: 'transparent' };

const toStored = (scene: readonly SceneElement[]): DiagramElements =>
  scene
    .filter((item) => !item.isDeleted && SUPPORTED.includes(item.type as Stored['type']))
    .map((item) => ({
      id: item.id, type: item.type as Stored['type'], x: item.x, y: item.y,
      width: Math.max(1, item.width), height: Math.max(1, item.height), text: item.text || undefined,
      backgroundColor: paint(item.backgroundColor), strokeColor: paint(item.strokeColor),
    }));

export function DiagramEditor({ elements, onChange }: { elements: DiagramElements; onChange: (items: DiagramElements) => void }) {
  // Re-seed whenever the stored elements change (including toolbar inserts). The seed is filtered
  // to supported shapes so Excalidraw's scene can never re-emit unsupported ones into the payload.
  const [preview, setPreview] = useState(false);
  const previous = useRef(JSON.stringify(elements.filter(isSupported)));
  const initialData = useMemo(() => ({
    elements: elements.filter(isSupported).map((item) => ({
      id: item.id, type: item.type, x: item.x, y: item.y, width: item.width, height: item.height,
      angle: 0, strokeColor: item.strokeColor ?? '#24221f', backgroundColor: item.backgroundColor ?? DEFAULT_FILL[item.type], fillStyle: 'solid', strokeWidth: 2,
      strokeStyle: 'solid', roughness: 1, opacity: 100, seed: 1, version: 1, versionNonce: 1, isDeleted: false, boundElements: null,
      updated: 1, link: null, locked: false, text: item.text ?? '', fontSize: 20, fontFamily: 3, textAlign: 'left', verticalAlign: 'middle', containerId: null, originalText: item.text ?? '', lineHeight: 1.25,
    })) as never,
    appState: { viewBackgroundColor: '#f8f5ed' },
  }), [elements]);

  const insert = (shape: (typeof SHAPES)[number]) => {
    const offset = (elements.length % 5) * 24;
    onChange([...elements, {
      id: crypto.randomUUID(), type: shape.type,
      x: shape.frame.x + offset, y: shape.frame.y + offset,
      width: shape.frame.width, height: shape.frame.height,
      text: shape.type === 'text' ? 'Label' : undefined,
    }]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-line-soft px-5 py-3">
        <p className="meta mr-2">SUPPORTED SHAPES</p>
        {SHAPES.map((shape) => (
          <button key={shape.type} onClick={() => insert(shape)} className="border border-line px-3 py-1.5 font-mono text-xs hover:bg-surface-2">
            + {shape.label}
          </button>
        ))}
        <button onClick={() => setPreview((p) => !p)} className="meta ml-auto border border-line px-3 py-1.5 text-ink-dim hover:text-acid">
          {preview ? '← BACK TO DRAWING' : 'READER PREVIEW →'}
        </button>
        {elements.length > 0 && !preview && (
          <button onClick={() => onChange([])} className="font-mono text-xs text-ink-mute hover:text-signal">
            CLEAR
          </button>
        )}
      </div>

      {preview ? (
        <div className="min-h-[70vh] bg-bg px-6 py-6">
          {elements.length
            ? <Diagram elements={elements} />
            : <p className="font-mono text-sm text-ink-mute">Nothing drawn yet — go back and add some shapes.</p>}
        </div>
      ) : (
        <div className="h-[70vh] bg-[#f8f5ed]">
          <Excalidraw
            initialData={initialData}
            onChange={(scene: readonly SceneElement[]) => {
              const saved = toStored(scene);
              const serialized = JSON.stringify(saved);
              if (serialized === previous.current) return;
              previous.current = serialized;
              onChange(saved);
            }}
          />
        </div>
      )}

      <p className="meta border-t border-line-soft px-5 py-3 text-ink-mute">
        {elements.length} ELEMENTS · ONLY BOX, OVAL, ARROW AND LABEL SHAPES ARE SAVED · READERS SEE WHATEVER YOU DRAW
      </p>
    </div>
  );
}
