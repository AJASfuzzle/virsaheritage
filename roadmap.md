# Multilingual corrections
- [x] Sweep shared screens and prevent individual translation callers from clearing other pending text or repeating in-flight requests.
- [x] Fix shared text tracking and language queue/cache.
- [x] Restore native-script translations when Google quota is exhausted.
- [x] Verify switching, navigation, persistence, and Kitab duplication across major sections (Hindi and Gujarati section sweep; Kannada live switching and navigation; all 38 translation-language samples).

# Kitab expansion
- [x] Add requested missing languages with source-backed facts and no duplicate entries.
- [x] Connect archive and homepage totals to the catalogue; preserve filters and leave the existing heritage-only Atlas pins unchanged (no language pins currently exist).
- [x] Test catalogue rules and verify Kitab filters and homepage count in the preview.

# Echoes search
- [x] Add debounced URL search above categories and clickable author names without changing access rules.
- [x] Run four search-rule tests; verify signed-in URL persistence, empty state, category control, clear, and full-width mobile search.
- [x] Verify Aarav Anand's real results and author-click flow after the requested published/public visibility update.

# Echoes browse and publishing separation
- [x] Public published feed, server search, author pages and private draft rules.
- [x] Separate publishing, editable owner profile, owner dashboard and sign-in return links.
- [x] Verify Aarav results signed out/in, combined filters, author page, mobile layout, publishing return/newest placement, private draft saving, editing/publishing and deletion; temporary test echoes removed.

# Login and password access
- [ ] Check hosted email settings, sign-in, signup confirmation and sign-out.
- [ ] Restore password recovery and correct account password changes.
- [ ] Run auth regression tests and verify access using a temporary account.
