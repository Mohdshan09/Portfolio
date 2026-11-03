import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Diagram } from '../Diagram';

// Coordinates taken from a real saved figure that spans far wider than the old fixed 800x440 box.
const WIDE = [
  { id: 'a', type: 'rectangle' as const, x: 236, y: 130, width: 215, height: 408 },
  { id: 'b', type: 'text' as const, x: 1753, y: 65, width: 362, height: 350, text: 'App Router\nServer Components\nPrisma' },
  { id: 'c', type: 'arrow' as const, x: 601, y: 27, width: 445, height: 369 },
];

describe('Diagram', () => {
  it('fits the viewBox to the drawing instead of a fixed frame', () => {
    const svg = renderToStaticMarkup(<Diagram elements={WIDE} />);
    const [x, y, w, h] = (svg.match(/viewBox="([^"]+)"/)?.[1] ?? '').split(' ').map(Number);
    expect(x! + w!).toBeGreaterThanOrEqual(2115);
    expect(x!).toBeLessThanOrEqual(236);
    expect(y!).toBeLessThanOrEqual(27);
    expect(y! + h!).toBeGreaterThanOrEqual(534);
  });

  it('splits a wrapped label into one tspan per line', () => {
    const svg = renderToStaticMarkup(<Diagram elements={WIDE} />);
    expect((svg.match(/<tspan/g) ?? []).length).toBe(3);
  });

  it('sizes text from the stored block height, not a global zoom factor', () => {
    const svg = renderToStaticMarkup(<Diagram elements={WIDE} />);
    const fontSize = Number(svg.match(/font-size="([\d.]+)"/)![1]);
    // 350 units tall over 3 lines at 1.25 line-height => the authored 20-unit size.
    expect(fontSize).toBeCloseTo(350 / 3 / 1.25, 5);
  });

  it('gives every figure on the same page its own arrow marker id', () => {
    // Two figures used to share id="arrow", so the second one borrowed the first's marker.
    const svg = renderToStaticMarkup(
      <>
        <Diagram elements={WIDE} />
        <Diagram elements={WIDE} />
      </>
    );
    const ids = [...svg.matchAll(/<marker id="([^"]+)"/g)].map((match) => match[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    for (const id of ids) expect(svg).toContain(`marker-end="url(#${id})"`);
  });

  it('renders the colours the author picked, and the old palette for legacy figures', () => {
    const svg = renderToStaticMarkup(
      <Diagram
        elements={[
          { id: 'painted', type: 'rectangle', x: 0, y: 0, width: 100, height: 50, backgroundColor: '#f4a261', strokeColor: '#2a9d8f' },
          { id: 'bare', type: 'rectangle', x: 200, y: 0, width: 100, height: 50 },
          { id: 'clear', type: 'ellipse', x: 400, y: 0, width: 100, height: 50, backgroundColor: 'transparent' },
        ]}
      />
    );
    expect(svg).toContain('fill="#f4a261"');
    expect(svg).toContain('stroke="#2a9d8f"');
    expect(svg).toContain('fill="#bde7ff"');
    expect(svg).toContain('fill="none"');
  });

  it('paints each arrow head in its own line colour', () => {
    const svg = renderToStaticMarkup(
      <Diagram
        elements={[
          { id: 'a', type: 'arrow', x: 0, y: 0, width: 100, height: 10, strokeColor: '#e63946' },
          { id: 'b', type: 'arrow', x: 0, y: 60, width: 100, height: 10 },
        ]}
      />
    );
    const markers = [...svg.matchAll(/<marker id="([^"]+)"/g)].map((match) => match[1]);
    expect(markers).toHaveLength(2);
    expect(svg).toContain('fill="#e63946"');
  });

  it('renders nothing for a chapter without a diagram', () => {
    expect(renderToStaticMarkup(<Diagram elements={[]} />)).toBe('');
  });
});
