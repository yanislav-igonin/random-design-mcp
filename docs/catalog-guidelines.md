# Catalog Guidelines

`random-design-mcp` catalog values should be short enough to scan and specific
enough to guide a frontend prompt.

## Naming Length

- Use 3-8 word phrases for high-impact prompt categories: `style`, `layout`,
  `imagery`, `motion`, and `signatureDetail`.
- Keep reference categories shorter when the label is already meaningful:
  `era`, `mood`, `tone`, `palette`, `material`, `texture`, and `lighting`.
- Avoid one-word values when they are broad buzzwords. Prefer a compact
  execution cue, such as `Museum-grade restraint with one focal object` instead
  of `Minimalism`.
- Avoid paragraph-like values. If a catalog value needs more than one clause,
  the renderer should carry the extra guidance.

## Taste Rules

- Meme, retro, and effects-driven directions are allowed. Phrase risky effects as
  usable interface accents, not default decoration.
- Scope risky details with words like `single`, `rare`, `subtle`, `localized`,
  `secondary`, or `never body text`.
- Keep catalog values in English and give every value at least one compatibility
  tag.
- Put values in the category where they are most useful. Photography belongs in
  `imagery`; grids and panes belong in `layout`; surface behavior belongs in
  `material` or `texture`.

## Anti-Patterns

Anti-pattern values should ban concrete failure modes, not broad aesthetics.
Prefer `Decorative hero that hides the product` over `Bad hero`.
