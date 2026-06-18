Replace the remote/Wikipedia `imageUrl` for five heritage sites with the user-uploaded images served from the Lovable CDN.

## Mapping
- image-63.png → `mysore-palace`
- image-59.png → `kanchipuram-silk`
- image-64.png → `mahabalipuram`
- image-65.png → `tanjore-paintings`
- image-66.png → `meenakshi`

## Steps
1. For each upload, run `lovable-assets create --file /mnt/user-uploads/<file> --filename <slug>.png > src/assets/<slug>.png.asset.json` (parallel).
2. In `src/lib/heritage-sites.ts`, add the 5 imports at the top alongside existing image imports.
3. Replace the `imageUrl` field on each of the 5 entries with `<slug>Img.url`.

No other files change. Affects only the Atlas/curated view imagery for these sites.
