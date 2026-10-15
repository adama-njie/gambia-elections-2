import React, { useId, useState } from 'react';
import { MAP_VIEWBOX, REGION_SHAPES, RIVER } from '@/data/mapGeometry';
import { REGIONS } from '@/data/regions';
import type { RegionCode } from '@/types';

export interface RegionDatum {
  /** Fill colour for the area. */
  color: string;
  /** Headline label, e.g. the leading candidate. */
  label: string;
  /** Supporting lines shown in the tooltip and the accessible table. */
  detail: { label: string; value: string; color?: string }[];
  /** Lead over second place, used for opacity shading. */
  margin?: number;
  /** Short value drawn inside the tile, e.g. "52.6%". */
  tileValue?: string;
}

/**
 * Schematic choropleth of the seven administrative areas.
 *
 * Accessibility: the map is always a supplementary view, never the only
 * one. Every area is a focusable control with a full accessible name, arrow
 * keys move between areas, and `RegionTable` renders the same data as a
 * real table for screen-reader, print and small-screen users.
 */
export default function RegionMap({
  data,
  caption,
  selected,
  onSelect,
}: {
  data: Partial<Record<RegionCode, RegionDatum>>;
  caption?: string;
  selected?: RegionCode | null;
  onSelect?: (code: RegionCode | null) => void;
}) {
  const [hovered, setHovered] = useState<RegionCode | null>(null);
  const titleId = useId();

  const active = hovered ?? selected ?? null;
  const activeDatum = active ? data[active] : undefined;
  const activeRegion = active ? REGIONS.find((r) => r.code === active) : undefined;
  const codes = REGIONS.map((r) => r.code);

  const onKeyDown = (event: React.KeyboardEvent, code: RegionCode) => {
    const index = codes.indexOf(code);
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index + 1;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index - 1;
    if (next !== null) {
      event.preventDefault();
      const target = codes[(next + codes.length) % codes.length]!;
      document.getElementById(`region-${target}`)?.focus();
      setHovered(target);
    }
  };

  return (
    <figure className="m-0">
      <svg
        viewBox={MAP_VIEWBOX}
        className="h-auto w-full"
        role="group"
        aria-labelledby={titleId}
        onMouseLeave={() => setHovered(null)}
      >
        <title id={titleId}>
          {caption ?? 'Schematic map of The Gambia by administrative area'}. Areas are shown in
          their approximate positions along the River Gambia, not to scale. The same figures are
          listed in the table beside the map.
        </title>

        {/* The river, for orientation. */}
        <rect
          x={RIVER.x}
          y={RIVER.y}
          width={RIVER.width}
          height={RIVER.height}
          rx={10}
          className="fill-sky-200/70 dark:fill-sky-500/20"
        />
        <text
          x={RIVER.x + RIVER.width - 14}
          y={RIVER.y + RIVER.height / 2 + 5}
          textAnchor="end"
          className="fill-sky-900/50 text-[15px] font-medium tracking-wide dark:fill-sky-200/40"
        >
          River Gambia
        </text>

        {REGIONS.map((region) => {
          const shape = REGION_SHAPES[region.code];
          const datum = data[region.code];
          const isActive = active === region.code;
          const isSelected = selected === region.code;
          // Shade by margin, so a knife-edge area reads differently from a
          // safe one rather than flattening everything to a single colour.
          const opacity =
            datum?.margin === undefined
              ? 0.9
              : Math.min(0.97, 0.45 + (Math.min(Math.abs(datum.margin), 30) / 30) * 0.52);
          return (
            <g key={region.code}>
              <rect
                id={`region-${region.code}`}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                rx={12}
                fill={datum?.color ?? '#CFD8DC'}
                fillOpacity={isActive ? 1 : opacity}
                stroke={isSelected ? '#101518' : '#FAFAF8'}
                strokeWidth={isSelected ? 4 : 2}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={
                  datum
                    ? `${region.name}: ${datum.label}. ${datum.detail
                        .map((d) => `${d.label} ${d.value}`)
                        .join(', ')}`
                    : `${region.name}: no data`
                }
                className="cursor-pointer transition-[fill-opacity] focus:outline-none focus-visible:stroke-accent focus-visible:[stroke-width:4]"
                onMouseEnter={() => setHovered(region.code)}
                onFocus={() => setHovered(region.code)}
                onBlur={() => setHovered(null)}
                onKeyDown={(event) => onKeyDown(event, region.code)}
                onClick={() => onSelect?.(selected === region.code ? null : region.code)}
              />
              <text
                x={shape.x + shape.width / 2}
                y={shape.y + shape.height / 2 - (datum?.tileValue ? 8 : -6)}
                textAnchor="middle"
                className="pointer-events-none fill-white text-[19px] font-bold"
                style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,.22)', strokeWidth: 3 }}
              >
                {region.code}
              </text>
              {datum?.tileValue && (
                <text
                  x={shape.x + shape.width / 2}
                  y={shape.y + shape.height / 2 + 16}
                  textAnchor="middle"
                  className="pointer-events-none fill-white text-[17px] font-semibold"
                  style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,.22)', strokeWidth: 3 }}
                >
                  {datum.tileValue}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {activeDatum && activeRegion && (
        <div className="card mt-3 p-3 text-sm" role="status">
          <p className="font-semibold">
            {activeRegion.name}
            {activeRegion.altName && <span className="muted font-normal"> ({activeRegion.altName})</span>}
          </p>
          <p className="muted mb-2 text-xs">{activeDatum.label}</p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
            {activeDatum.detail.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-2 text-xs">
                <dt className="flex min-w-0 items-center gap-1.5">
                  {row.color && (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: row.color }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate">{row.label}</span>
                </dt>
                <dd className="tabular shrink-0 font-semibold">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <figcaption className="muted mt-2 text-xs leading-relaxed">
        {caption && <span className="block">{caption}</span>}
        Schematic, not to scale: areas are placed in their approximate positions along the river and
        sized for legibility, so that Banjul and Kanifing remain visible. Use arrow keys to move
        between areas.
      </figcaption>
    </figure>
  );
}

/** The map's data as an accessible table. Always render this alongside the map. */
export function RegionTable({
  data,
  columns,
  caption,
}: {
  data: Partial<Record<RegionCode, RegionDatum>>;
  columns: string[];
  caption: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="hairline border-b text-left">
            <th scope="col" className="py-2 pr-3 font-semibold">
              Area
            </th>
            <th scope="col" className="py-2 pr-3 font-semibold">
              Leading
            </th>
            {columns.map((column) => (
              <th key={column} scope="col" className="py-2 pr-3 text-right font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {REGIONS.map((region) => {
            const datum = data[region.code];
            return (
              <tr key={region.code} className="hairline border-b last:border-0">
                <th scope="row" className="py-2 pr-3 text-left font-medium">
                  {region.name}
                  {region.altName && <span className="muted"> ({region.altName})</span>}
                </th>
                <td className="py-2 pr-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: datum?.color ?? '#CFD8DC' }}
                      aria-hidden="true"
                    />
                    {datum?.label ?? '—'}
                  </span>
                </td>
                {columns.map((column) => {
                  const cell = datum?.detail.find((d) => d.label === column);
                  return (
                    <td key={column} className="tabular py-2 pr-3 text-right">
                      {cell?.value ?? '—'}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
