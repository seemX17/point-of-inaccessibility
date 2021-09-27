export class Cell {
  x: number;
  y: number;
  h: number;
  d: number;
  max: number;

  constructor(x: any, y: any, h: any, polygon: any) {
    this.x = x; // cell center x
    this.y = y; // cell center y
    this.h = h; // half the cell size
    this.d = this.pointToPolygonDist(x, y, polygon); // distance from cell center to polygon
    this.max = this.d + this.h * Math.SQRT2; // max distance to polygon within a cell
  }

  pointToPolygonDist = (x: number, y: number, polygon: any) => {
    let inside = false;
    let minDistSq = Infinity;

    for (let k = 0; k < polygon.length; k++) {
      let ring = polygon[k];

      for (let i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
        let a = ring[i];
        let b = ring[j];

        if ((a[1] > y !== b[1] > y) &&
          (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) inside = !inside;

        minDistSq = Math.min(minDistSq, this.getSegDistSq(x, y, a, b));
      }
    }

    return minDistSq === 0 ? 0 : (inside ? 1 : -1) * Math.sqrt(minDistSq);
  }

  getSegDistSq = (px: any, py: any, a: any, b: any) => {

    let x = a[0];
    let y = a[1];
    let dx = b[0] - x;
    let dy = b[1] - y;

    if (dx !== 0 || dy !== 0) {

      let t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);

      if (t > 1) {
        x = b[0];
        y = b[1];

      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }

    dx = px - x;
    dy = py - y;

    return dx * dx + dy * dy;
  }
}