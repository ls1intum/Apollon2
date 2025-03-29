// connection.ts
/**
 * This file provides a simplified connection path computation.
 * It calculates port positions based solely on a node's width and height.
 */

import { Position} from "@xyflow/react";

export interface IPoint {
    x: number;
    y: number;
  }
  
  export enum Direction {
    Left = "Left",
    Right = "Right",
    Top = "Top",
    Bottom = "Bottom",
    Upright = 'Upright',
    Upleft = 'Upleft',
    Downright = 'Downright',
    Downleft = 'Downleft',
    Topright = 'Topright',
    Topleft = 'Topleft',
    Bottomright = 'Bottomright',
    Bottomleft = 'Bottomleft',

  }
  
  export interface NodeBounds {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export function getPortsForElement(bounds: NodeBounds): Record<Position, IPoint> {
    return {
      [Position.Top]: {x: bounds.width / 2,y : 0},
      [Position.Right]: {x: bounds.width, y: bounds.height / 2},
      [Position.Bottom]: {x: bounds.width / 2, y: bounds.height},
      [Position.Left]: {x: 0, y:bounds.height / 2},
    };
  };

  /**
   * The Connection class computes an edge path between two nodes.
   * It uses each node’s width and height to determine rough bounds, then computes
   * port positions at the midpoints of the node sides.
   */
  export class Connection {
    /**
     * Computes a rough connection path between two nodes.
     *
     * @param source An object containing the source node’s element (with width and height)
     *               and the desired port Position.
     * @param target An object containing the target node’s element (with width and height)
     *               and the desired port Position.
     * @param options Options specifying whether the connection should be straight or variable.
     *
     * @returns An array of IPoint objects representing the connection path.
     */
    static computePath(
      source: { position: { x: number; y: number }; width: number, height: number, direction: Position },
      target: { position: { x: number; y: number };width: number, height: number, direction: Position },
      options: { isStraight: boolean; isVariable: boolean }
    ): IPoint[] {
      // Create rough bounds for each node, assuming (0,0) as the top-left.
      const sourceBounds: NodeBounds = {
        x: source.position.x,
        y: source.position.y,
        width: source.width,
        height: source.height,
      };
  
      const targetBounds: NodeBounds = {
        x: target.position.x,
        y: target.position.y,
        width: target.width,
        height: target.height,
      };
      function addPoint(point: IPoint, offsetX: number, offsetY: number): IPoint {
        return { x: point.x + offsetX, y: point.y + offsetY };
      }
      // Compute port positions from the node bounds.
      const sourcePortPosition = addPoint(
        getPortsForElement(sourceBounds)[source.direction],
        source.position.x,
        source.position.y
      );
      const targetPortPosition = addPoint(
        getPortsForElement(targetBounds)[target.direction],
        target.position.x,
        target.position.y
      );
      
      console.log("Source Port", sourcePortPosition)
      console.log("Target Port", targetPortPosition)
     

      // If a straight line is requested, return the direct line.
      if (options.isStraight) {
        // Adjust if the points are identical.
        if (
          sourcePortPosition.x === targetPortPosition.x &&
          sourcePortPosition.y === targetPortPosition.y
        ) {
          targetPortPosition.x += 1;
          targetPortPosition.y += 1;
        }
        return [sourcePortPosition, targetPortPosition];
      }
  
      // If variable routing is allowed, try to compute an alternative (not implemented here).
    //   if (options.isVariable) {
    //     const straightPath = tryFindStraightPath(source, target);
    //     if (straightPath !== null) {
    //       if (
    //         straightPath[0].x === straightPath[1].x &&
    //         straightPath[0].y === straightPath[1].y
    //       ) {
    //         straightPath[1].x += 1;
    //         straightPath[1].y += 1;
    //       }
    //       return straightPath;
    //     }
    //   }
  
      // Fallback: Return the direct (straight) connection if no alternative is found.
      return [sourcePortPosition, targetPortPosition];
    }
  
    /**
     * A stub for finding an alternative (variable) routing path.
     * For now, it always returns null.
     */
    // private static tryFindStraightPath(
    //     source: { position: { x: number; y: number }; width: number, height: number, Position: Position },
    //     target: { position: { x: number; y: number };width: number, height: number, Position: Position },
    // ): IPoint[] | null {
    //   // Insert more advanced routing logic here if needed.
    //   console.log("not finished function", source, target)
    //   return null;
    // }
  }
  
  // Make sure to import or define these types and functions:
// - Endpoint, IPoint, Position
// - determineHandleEdge(sourcePosition: Position): Position
// - computeOverlap(range1: [number, number], range2: [number, number]): [number, number] | null
export function computeOverlap(range1: [number, number], range2: [number, number]): [number, number] | null {
    const [from1, to1] = range1;
    const [from2, to2] = range2;
  
    const largerFrom = Math.max(from1, from2);
    const smallerTo = Math.min(to1, to2);
  
    return largerFrom <= smallerTo ? [largerFrom, smallerTo] : null;
  }

export function pointsToSvgPath(points: IPoint[]): string {
if (points.length === 0) return '';

// Start with the first point using the "M" command.
const pathCommands = [`M ${points[0].x} ${points[0].y}`];

// Add "L" command for each subsequent point.
for (let i = 1; i < points.length; i++) {
    pathCommands.push(`L ${points[i].x} ${points[i].y}`);
}

// Combine commands into a single string
return pathCommands.join(' ');
}
export function tryFindStraightPath(
    source: { position: { x: number; y: number }; width: number, height: number, direction: Position },
    target: { position: { x: number; y: number };width: number, height: number, direction: Position },
  ): string | null {
    const OVERLAP_THRESHOLD = 40;
    const sourceHandleEdge = source.direction
    const targetHandleEdge = target.direction
  
    /*                                                
        #######              #######              #######    
        # ~~~ # -----------> # ~~~ # -----------> # ~~~ #   
        # ~~~ #      |       #######     |----->  # ~~~ #   
        # ~~~ # -----0                   0----->  # ~~~ #  
        #######                                   #######  
    */
    if (
      sourceHandleEdge === Position.Right &&
      targetHandleEdge === Position.Left &&
      target.position.x >= source.position.x + source.width
    ) {
      const overlapY = computeOverlap(
        [
          source.position.y,
          source.position.y +
            Math.max(OVERLAP_THRESHOLD, source.height),
        ],
        [
          target.position.y,
          target.position.y +
            Math.max(OVERLAP_THRESHOLD, target.height),
        ]
      );
  
      if (overlapY !== null && overlapY[1] - overlapY[0] >= OVERLAP_THRESHOLD) {
        const middleY = (overlapY[0] + overlapY[1]) / 2;
        const start: IPoint = {
          x: source.position.x + source.width,
          y: middleY,
        };
        const end: IPoint = { x: target.position.x, y: middleY };
        return pointsToSvgPath([start, end]);
      }
    }
  
    /*                                                
        #######              #######              #######    
        # ~~~ # <----------- # ~~~ # <----------- # ~~~ #   
        # ~~~ # <----|       #######     |        # ~~~ #   
        # ~~~ # <----0                   0------  # ~~~ #  
        #######                                   #######  
    */
    if (
      sourceHandleEdge === Position.Left &&
      targetHandleEdge === Position.Right &&
      source.position.x >= target.position.x + target.width
    ) {
      const overlapY = computeOverlap(
        [
          source.position.y,
          source.position.y +
            Math.max(OVERLAP_THRESHOLD, source.height),
        ],
        [
          target.position.y,
          target.position.y +
            Math.max(OVERLAP_THRESHOLD, target.height),
        ]
      );
  
      if (overlapY !== null && overlapY[1] - overlapY[0] >= OVERLAP_THRESHOLD) {
        const middleY = (overlapY[0] + overlapY[1]) / 2;
        const start: IPoint = { x: source.position.x, y: middleY };
        const end: IPoint = {
          x: target.position.x + target.width,
          y: middleY,
        };
        return pointsToSvgPath([start, end]);
      }
    }
  
    /*
        ##################
        # ~~~~~~~~~~~~~~ #
        ##################
            |   |   |
            0---|---0
                ∨
            #########
            # ~~~~~ #
            #########
                |
            0---0---0
            |       |
            v       v
        ##################
        # ~~~~~~~~~~~~~~ #
        ##################
    */
    if (
      sourceHandleEdge === Position.Bottom &&
      targetHandleEdge === Position.Top &&
      target.position.y >= source.position.y + source.height
    ) {
        console.log("Here")
      const overlapX = computeOverlap(
        [
          source.position.x,
          source.position.x + source.width,
        ],
        [
          target.position.x,
          target.position.x + target.width,
        ]
      );
      console.log("Overlap", overlapX)
  
      if (overlapX !== null && overlapX[1] - overlapX[0] >= OVERLAP_THRESHOLD) {
        const middleX = (overlapX[0] + overlapX[1]) / 2;
        const start: IPoint = {
          x: middleX,
          y: source.position.y + source.height,
        };
        const end: IPoint = { x: middleX, y: target.position.y };
        console.log("start end", start, end)
        return pointsToSvgPath([start, end]);
      }
    }
  
    /*
        ##################
        # ~~~~~~~~~~~~~~ #
        ##################
            ∧   ∧   ∧
            |   |   |
            0---|---0
                |
            #########
            # ~~~~~ #
            #########
                ∧
                |
            0---0---0
            |       |
        ##################
        # ~~~~~~~~~~~~~~ #
        ##################
    */
    if (
      sourceHandleEdge === Position.Top &&
      targetHandleEdge === Position.Bottom &&
      source.position.y >= target.position.y + target.height
    ) {
      const overlapX = computeOverlap(
        [
          source.position.x,
          source.position.x + source.width,
        ],
        [
          target.position.x,
          target.position.x + target.width,
        ]
      );
  
      if (overlapX !== null && overlapX[1] - overlapX[0] >= OVERLAP_THRESHOLD) {
        const middleX = (overlapX[0] + overlapX[1]) / 2;
        const start: IPoint = { x: middleX, y: source.position.y };
        const end: IPoint = {
          x: middleX,
          y: target.position.y + target.height,
        };
        return pointsToSvgPath([start, end]);
      }
    }
  
    return null;
  }
  