import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { BlogInput } from '@portfolio/shared';

type Diagram = NonNullable<BlogInput['chapters'][number]['diagram']>;
type Stored = NonNullable<Diagram[number]>;

export function DiagramEditor({ elements, onChange }: { elements: Diagram; onChange: (items: Diagram) => void }) {
  const initial = elements.map((item) => ({
    id: item.id, type: item.type === 'arrow' ? 'arrow' : item.type, x: item.x, y: item.y, width: item.width, height: item.height,
    angle: 0, strokeColor: '#24221f', backgroundColor: item.type === 'text' ? 'transparent' : '#bde7ff', fillStyle: 'solid', strokeWidth: 2,
    strokeStyle: 'solid', roughness: 1, opacity: 100, seed: 1, version: 1, versionNonce: 1, isDeleted: false, boundElements: null,
    updated: Date.now(), link: null, locked: false, text: item.text ?? '', fontSize: 20, fontFamily: 3, textAlign: 'left', verticalAlign: 'middle', containerId: null, originalText: item.text ?? '', lineHeight: 1.25,
  }));
  return <div className="h-[520px] border-l border-line-soft bg-[#f8f5ed]"><Excalidraw initialData={{ elements: initial as never, appState: { viewBackgroundColor: '#f8f5ed' } }} onChange={(scene) => {
    const saved = scene.filter((item: any) => !item.isDeleted && ['rectangle', 'ellipse', 'arrow', 'text'].includes(item.type)).map((item: any): Stored => ({ id: item.id, type: item.type, x: item.x, y: item.y, width: Math.max(1, item.width), height: Math.max(1, item.height), text: item.text || undefined }));
    onChange(saved);
  }} /></div>;
}
