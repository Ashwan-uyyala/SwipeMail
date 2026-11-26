The ripple animation direction is already correct. Do not change its direction, origin, or overall animation flow.

However, there is one major issue: a white screen/white flash appears during the transition. I absolutely do not want that.

### Fix the transition without changing its current behaviour.

1. Completely eliminate the white screen, white flash, and any intermediate blank frame.
2. Never show a white overlay when switching from dark mode to light mode or vice versa.
3. The incoming theme must be revealed directly over the existing theme.
4. The transition should be a continuous visual flow, not a sequence of screen colour replacements.
5. Preserve the existing top-right to bottom-left diagonal ripple direction.

### Feather and transparency

This is the most important visual requirement:

- Use approximately 50% feathering at the expanding ripple boundary.
- Create a naturally blended, semi-transparent transition edge.
- The incoming theme should gradually blend with the outgoing theme.
- Avoid sharp circular boundaries.
- Avoid bright white outlines, artificial glowing rings, or opaque white layers.
- The feathered boundary should feel soft, fluid, and premium.
- The transparency must reveal the actual underlying old theme rather than a white background.

### Technical requirements

- Inspect the existing View Transitions API / CSS animation implementation.
- Identify what is causing the white flash.
- Remove any intermediate white background or hardcoded white transition layer.
- Ensure the outgoing theme snapshot and incoming theme snapshot use the correct theme colours.
- Avoid applying an opaque white background to `::view-transition-old`, `::view-transition-new`, or the transition overlay.
- Ensure the transition remains continuous without flickering.
- Keep the theme state and persistence logic unchanged.
- Prevent any blank frame between theme changes.

### Final expected result

Dark → Light: The light theme naturally expands from the top-right corner, with a soft 50% feathered boundary, gradually blending into the existing dark theme.

Light → Dark: The dark theme naturally expands from the top-right corner, with the same soft feathered boundary, gradually blending into the existing light theme.

**Do not redesign anything. Do not change the animation direction. Just eliminate the white flash and make the existing ripple transition look natural, transparent, smooth, and premium.**

Test both directions in the actual browser before finishing.