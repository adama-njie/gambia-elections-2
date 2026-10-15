import type { RegionCode } from '@/types';

/**
 * Schematic map of the seven administrative areas.
 *
 * This is deliberately a schematic, not a survey outline. The Gambia is a
 * narrow country following the river for some 300km, which makes a
 * true-shape choropleth almost unreadable: Banjul and Kanifing between them
 * hold over a fifth of the register but would be invisible slivers, while
 * sparsely registered areas would dominate the picture. A schematic that
 * keeps the areas in their correct relative positions along the river, at
 * legible sizes, tells the electoral story honestly and the geographic one
 * approximately. The interface says so wherever the map is shown.
 *
 * Positions: Banjul sits at the river mouth in the west, Kanifing beside
 * it, North Bank and Central River on the north bank, West Coast and Lower
 * River on the south bank, Upper River at the eastern end spanning both.
 */

export const MAP_VIEWBOX = '0 0 960 400';

export interface RegionShape {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const REGION_SHAPES: Record<RegionCode, RegionShape> = {
  // At the mouth of the river, within the river band itself.
  BJL: { x: 18, y: 154, width: 74, height: 64 },
  // The urban municipality immediately south of the capital.
  KMC: { x: 18, y: 232, width: 142, height: 148 },
  // North bank, western half.
  NBR: { x: 170, y: 20, width: 236, height: 122 },
  // South bank, western half. The largest register in the country.
  WCR: { x: 170, y: 232, width: 236, height: 148 },
  // North bank, central.
  CRR: { x: 416, y: 20, width: 228, height: 122 },
  // South bank, central.
  LRR: { x: 416, y: 232, width: 228, height: 148 },
  // The eastern end, spanning both banks.
  URR: { x: 654, y: 20, width: 288, height: 360 },
};

/** The River Gambia, drawn as a band between the north and south bank areas. */
export const RIVER = { x: 100, y: 154, width: 842, height: 64 };
