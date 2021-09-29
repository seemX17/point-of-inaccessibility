import TinyQueue from "tinyqueue";
import { Cell } from "./cell";

export class QuadTree {
  poleOfInaccessibility: any;

  constructor(polygon: any) {
    this.calculatePoI(polygon);
  }

  calculatePoI = (polygon: any) => {
    // find the bounding box of the outer ring
    let { minX, minY, maxX, maxY } = this.findMinMax(polygon);
    let width = maxX - minX;
    let height = maxY - minY;
    let cellSize = Math.min(width, height);
    let h = cellSize / 2;

    // a priority queue of cells in order of their "potential" (max distance to polygon)
    let cellQueue = new TinyQueue(undefined, (a: any, b: any) => {
      return b.max - a.max;
    });

    // cover polygon with initial cells
    for (let x = minX; x < maxX; x += cellSize) {
      for (let y = minY; y < maxY; y += cellSize) {
        cellQueue.push(new Cell(x + h, y + h, h, polygon));
      }
    }

    // take centroid as the first best guess
    let bestCell = this.getCentroidCell(polygon);
    // second guess: bounding box centroid
    let bboxCell = new Cell(minX + width / 2, minY + height / 2, 0, polygon);
    if (bboxCell.d > bestCell.d) bestCell = bboxCell;

    let numProbes = cellQueue.length;

    while (cellQueue.length) {
      // pick the most promising cell from the queue
      let cell = cellQueue.pop();

      // update the best cell if we found a better one
      if (cell.d > bestCell.d) {
        bestCell = cell;
        console.log(
          "found best %f after %d probes",
          Math.round(1e4 * cell.d) / 1e4,
          numProbes
        );
      }

      // do not drill down further if there's no chance of a better solution
      if (cell.max - bestCell.d <= 1) continue;

      // split the cell into four cells
      h = cell.h / 2;
      cellQueue.push(new Cell(cell.x - h, cell.y - h, h, polygon));
      cellQueue.push(new Cell(cell.x + h, cell.y - h, h, polygon));
      cellQueue.push(new Cell(cell.x - h, cell.y + h, h, polygon));
      cellQueue.push(new Cell(cell.x + h, cell.y + h, h, polygon));
      numProbes += 4;
    }

    let poleOfInaccessibility = [bestCell.x, bestCell.y];
    this.poleOfInaccessibility = poleOfInaccessibility;
  };

  getPoI() {
    return this.poleOfInaccessibility;
  }

  findMinMax = (polygon: any) => {
    let minX: any, maxX: any, minY: any, maxY: any;
    polygon.map((coord: any, i: number) => {
      if (!i || coord[0] < minX) {
        minX = coord[0];
      }
      if (!i || coord[0] > maxX) {
        maxX = coord[0];
      }
      if (!i || coord[1] < minY) {
        minY = coord[1];
      }
      if (!i || coord[1] > maxY) {
        maxY = coord[1];
      }
      return coord;
    });
    return { minX, maxX, minY, maxY };
  };

  // get polygon centroid
  getCentroidCell = (polygon: any) => {
    let area = 0;
    let x = 0;
    let y = 0;
    let points = polygon[0];

    for (let i = 0, len = points.length, j = len - 1; i < len; j = i++) {
      let a = points[i];
      let b = points[j];
      let f = a[0] * b[1] - b[0] * a[1];
      x += (a[0] + b[0]) * f;
      y += (a[1] + b[1]) * f;
      area += f * 3;
    }
    if (area === 0) return new Cell(points[0][0], points[0][1], 0, polygon);
    return new Cell(x / area, y / area, 0, polygon);
  };
}
