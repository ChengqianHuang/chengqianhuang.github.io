# Blog maintenance

## Pelican test submissions

Read `PELICAN.md`, `pelican-test.json`, and `schemas/pelican-result.schema.json` before adding or changing a pelican result. All agents and models use the same versioned record format (v1.0 static / v1.1 animated). Read `pelican-test-animated.json` for animated submissions.

- Preserve published result files and the exact generated SVG. Add a new record for a regeneration, model version, harness, or changed drawing.
- Record actual model identity separately from harness. Unknown model IDs, harness versions and generation parameters must stay null/empty; never infer hidden settings. User-supplied identities must use `identitySource: user-reported` and note whether verified.
- Record whether generation used existing conversation history, how many attempts were made, which result was selected, tools actually used, and any edits.
- Use the exact test prompt. Never relabel layout examples as real test results.
- Validate JSON schemas, file paths, SVG dimensions and byte hashes with `scripts/validate_pelican.py`, then run `scripts/test_pelican_validation.py` before committing a result.
- Render the SVG to check the file actually displays; do not improve the drawing after generation and still report `postProcessing: none`.

- Keep the public gallery minimal: model name, harness name, and prompt only. Provenance, attempt counts, protocol types and validation details stay in submission JSON and repository documentation, not gallery UI. Playback controls are allowed.
