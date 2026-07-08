# setup-fnpack

GitHub Action to install [fnpack](https://developer.fnnas.com/docs/cli/fnpack/) CLI for building fnOS `.fpk` packages.

## Project Structure

```
├── action.yml              # Action definition (node22)
├── src/main.ts             # Core logic
├── src/__tests__/          # Vitest tests
├── scripts/check-version.ts # Auto-update checker
├── dist/                   # Bundled output (commit this)
└── .github/workflows/
    └── check-update.yml    # Weekly version check cron
```

## Development

```bash
npm test          # Run tests
npm run build     # Bundle to dist/
npm run typecheck # Type check
```

## How It Works

1. Detects runner OS (linux/darwin/win32) and arch (x64/arm64)
2. Downloads fnpack binary from `static2.fnnas.com`
3. Caches via `@actions/tool-cache` (RUNNER_TOOL_CACHE)
4. Adds to PATH, outputs `fnpack-path`

## Release Process

1. Update `version` default in `action.yml`
2. Run `npm run build` to update `dist/`
3. Commit and tag `v1.x.x`
4. Update major version tag: `git tag -f v1 v1.x.x && git push -f origin v1`

## Auto-Update

Weekly cron checks fnpack docs for new version, creates PR if updated.
