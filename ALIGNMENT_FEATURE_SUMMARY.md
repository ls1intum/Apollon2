# Magnetic Alignment Feature - Quick Reference

## What's New?
When you drag a node in Apollon2, colored dashed guide lines appear to show alignment opportunities with nearby nodes.

## How It Works

```
BEFORE DRAGGING:
┌─────────┐
│ Node A  │
└─────────┘

        ┌─────────┐
        │ Node B  │
        └─────────┘


DURING DRAGGING (when Node B aligns with Node A):
┌─────────┐
│ Node A  │
└─────────┘
    │ (vertical red guide line)
    │
    ┌─────────┐
    │ Node B  │
    └─────────┘
```

## Key Files Created

| File | Purpose |
|------|---------|
| `store/alignmentGuidesStore.ts` | State management for alignment guides |
| `utils/alignmentUtils.ts` | Alignment detection and calculation logic |
| `hooks/useNodeDrag.ts` | Drag event handler that calculates guides |
| `components/AlignmentGuides.tsx` | Visual component for rendering guide lines |
| `styles/alignmentGuides.css` | Styling and animations for guides |

## Guide Colors

- **Red dashed lines** (vertical): Indicates horizontal alignment
- **Teal dashed lines** (horizontal): Indicates vertical alignment

## Configuration

### Alignment Threshold
Default: 10 pixels (distance when guides appear)
Edit: `utils/alignmentUtils.ts` line 3

### Guide Colors
Default: Red (#ff6b6b) and Teal (#4ecdc4)
Edit: `styles/alignmentGuides.css` lines 24-25

## Alignment Detection Points

The feature detects alignment at:
- **Left edges**
- **Center points**
- **Right edges**

This works for both horizontal and vertical alignment.

## Example: Center Alignment

```
Dragging this:
        ┌─────────┐
        │ Node B  │
        └─────────┘

Near this:
┌─────────────┐
│   Node A    │
└─────────────┘
       ↓
   CENTER GUIDE
   (horizontal teal line appears)
```

## Performance

✅ Efficient computation (only during drag)  
✅ Hardware-accelerated SVG rendering  
✅ Automatic cleanup on drag stop  
✅ No memory leaks  

## Next Steps (Optional)

To enable automatic node snapping when aligned:
1. Uncomment snapping code in `hooks/useNodeDrag.ts` (lines 25-42)
2. Nodes will automatically snap to aligned positions

---

**Feature Status**: ✅ Complete and Ready to Use
**Compatibility**: All diagram types
**Performance Impact**: Minimal
