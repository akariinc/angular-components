
<a name="22.0.x"></a>
# 22.0.x Changes to original

### cdk

| Class | Description |
| -- | -- |
| ListBox | Allow HTML content (including inline SVG) on the cdkOption directive via `@Input('display')`. Falls back to rendering a string `value` when the option has no projected content. |
| ListBox | Added ngOnChanges to the cdkOption directive so `display`/`value` can be provided asynchronously (e.g. via the async pipe). |
| ListBox | Custom SVG-preserving sanitizer (`listbox-custom-sanitizer.ts`). DOM-based allowlist sanitizer (same architecture as Angular's built-in sanitizer, extended with SVG elements/attributes). Replaces the earlier regex-based sanitizer, which was bypassable (unquoted event handlers, unclosed tags, entity-encoded URLs). |

### material

| Class | Description |
| -- | -- |
| Tooltip | Allow HTML content (including inline SVG) in `matTooltip`. The message is sanitized in the `MatTooltip` directive and rendered via `innerHTML` in `TooltipComponent`; the ARIA description uses the plain text of the message. |
| Tooltip | Content can be loaded asynchronously (async pipe), and the rendered HTML updates if the message changes while the tooltip is visible. |
| Tooltip | Custom SVG-preserving sanitizer (`tooltip-custom-sanitizer.ts`), identical copy of the cdk one (kept per-module for build simplicity). |

### Maintenance notes

- The two sanitizer files must be kept identical; update both when changing one.
- Not allowed by the sanitizer (by design): `script`, `style`, `iframe`, `object`, `embed`, `form`, `meta`, `link`, `base`, `template`, `math`, `foreignObject`, SMIL animation elements, event handler attributes, `javascript:`/non-image `data:` URLs.
