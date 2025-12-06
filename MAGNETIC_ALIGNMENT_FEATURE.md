# Magnetic Alignment Feature - Implementation Guide

## Overview
This document describes the new magnetic alignment feature that displays helper lines when hovering or dragging nodes in Apollon2. The feature helps users align nodes vertically or horizontally with adjacent nodes.

## Features
- **Visual alignment guides**: Display dashed lines when dragging nodes near others
- **Threshold-based detection**: Guides appear when nodes are within 10 pixels of alignment
- **Multiple alignment points**: Supports left, center, and right edge alignment (horizontal), and top, center, and bottom edge alignment (vertical)
- **Automatic guide clearing**: Guides automatically disappear when drag ends
- **Smooth animations**: Pulsing effect on guide lines for better visibility
- **Color-coded guides**: Vertical lines (red) and horizontal lines (teal) for easy distinction

## Implementation Components

### 1. Store (`store/alignmentGuidesStore.ts`)
Manages the state of alignment guides using Zustand.

**Types:**
- `AlignmentGuide`: Represents a single guide line with type (vertical/horizontal) and position
- `AlignmentGuidesStore`: Store for managing guides state

**Methods:**
- `setGuides(guides)`: Update guides in the store
- `clearGuides()`: Clear all guides

### 2. Utilities (`utils/alignmentUtils.ts`)
Contains calculation logic for detecting alignments and snapping nodes.

**Key Functions:**
- `getNodeBounds(node)`: Calculates bounding box of a node including center points
- `calculateAlignmentGuides(draggedNode, allNodes, threshold)`: Detects alignment opportunities and returns guide lines
- `snapNodeToGuides(draggedNode, guides, threshold)`: Calculates position adjustments for snapping (optional feature)

**Configuration:**
- `ALIGNMENT_THRESHOLD` (10px): Distance within which guides appear. Adjust in `alignmentUtils.ts` line 3

### 3. Hooks

#### `hooks/useNodeDrag.ts`
Handles drag events and calculates alignment guides.

- Tracks node drag movements
- Calculates applicable guides based on nearby nodes
- Updates the alignment guides store

#### `hooks/useNodeDragStop.ts`
Modified to clear guides when drag ends.

- Clears guides on drag stop
- Maintains existing node positioning logic

### 4. Components (`components/AlignmentGuides.tsx`)
Renders the visual alignment guides as SVG lines.

- Renders vertical and horizontal guide lines
- Respects viewport zoom and pan transformations
- Non-interactive (pointer-events: none)

### 5. Styling (`styles/alignmentGuides.css`)
CSS styling for alignment guide visualization.

**Colors (customizable via CSS variables):**
- `--apollon2-guide-vertical`: Color for vertical lines (default: #ff6b6b - red)
- `--apollon2-guide-horizontal`: Color for horizontal lines (default: #4ecdc4 - teal)

**Features:**
- Dashed line pattern (5px dash, 5px gap)
- Pulsing animation for visibility
- 80% opacity for non-intrusive display

### 6. Context Integration
Updated `store/context.ts` to provide alignment guides context throughout the app.

- `AlignmentGuidesStoreContext`: React Context for alignment guides store
- `useAlignmentGuidesStore`: Hook to access alignment guides store

### 7. Main App Integration
Modified `App.tsx` to integrate the feature:
- Imported `useNodeDrag` hook
- Added `AlignmentGuides` component inside ReactFlow
- Called `onNodeDrag` callback on ReactFlow

## Configuration

### Adjusting Threshold
Edit `library/lib/utils/alignmentUtils.ts`:
```typescript
const ALIGNMENT_THRESHOLD = 10 // Change to desired pixel distance
```

### Customizing Colors
Edit `library/lib/styles/alignmentGuides.css` or set CSS variables in your theme:
```css
--apollon2-guide-vertical: #ff6b6b;      /* Vertical guide color */
--apollon2-guide-horizontal: #4ecdc4;    /* Horizontal guide color */
```

### Enabling Node Snapping (Optional)
Currently, snapping is disabled by default. To enable automatic position snapping:

1. Uncomment the snapping code in `hooks/useNodeDrag.ts` (lines 25-42)
2. Guides will automatically snap nodes to aligned positions

## Files Modified/Created

### Created:
- `store/alignmentGuidesStore.ts` - Alignment guides state management
- `utils/alignmentUtils.ts` - Alignment calculation utilities
- `hooks/useNodeDrag.ts` - Drag event handler hook
- `components/AlignmentGuides.tsx` - Guide visualization component
- `styles/alignmentGuides.css` - Styling for alignment guides

### Modified:
- `App.tsx` - Integrated useNodeDrag hook and AlignmentGuides component
- `store/context.ts` - Added alignment guides context and hook
- `store/index.ts` - Exported alignment guides store
- `hooks/index.ts` - Exported useNodeDrag hook
- `hooks/useNodeDragStop.ts` - Added guide clearing on drag stop
- `components/index.ts` - Exported AlignmentGuides component
- `utils/index.ts` - Exported alignment utilities
- `apollon-editor.tsx` - Added alignment guides store provider

## Usage

The feature automatically activates when:
1. A user drags a node
2. The node comes within the threshold distance of another node's alignment points
3. Visual guide lines appear showing the alignment opportunity

The guides automatically clear when:
1. The user stops dragging
2. The nodes are no longer in threshold range

## Future Enhancements

Possible improvements for future versions:
1. **Smart snapping**: Automatically snap nodes when within threshold
2. **Distance indicators**: Display pixel distance between aligned edges
3. **Multi-node alignment**: Show guides for multiple nodes being dragged together
4. **Alignment hotkeys**: Toggle alignment guides on/off with keyboard shortcuts
5. **Alignment preferences**: User settings for threshold, colors, and animation
6. **Snap-to-grid integration**: Combine with existing snap-to-grid functionality

## Testing

To test the feature:
1. Open the diagram in Apollon2
2. Drag a node close to another node (within ~10 pixels)
3. Observe colored dashed lines appearing when aligned
4. Release the node to clear the guides
5. Guides should disappear smoothly

## Performance Considerations

- Guides are calculated only during drag operations (not during idle)
- Store updates are optimized with Zustand's shallow comparison
- SVG rendering is hardware-accelerated
- Guides automatically clear to prevent memory leaks
