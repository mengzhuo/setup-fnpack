# setup-fnpack

GitHub Action to install [fnpack](https://developer.fnnas.com/docs/cli/fnpack/) for building fnOS `.fpk` packages.

## Usage

```yaml
steps:
  - uses: actions/checkout@v7
  - uses: mengzhuo/setup-fnpack
  - run: fnpack build
```

### Specify version

```yaml
- uses: mengzhuo/setup-fnpack@v1
  with:
    version: '1.2.3'
```

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `version` | fnpack version to install | `1.2.3` |
| `dir` | Working directory for fnpack commands | `.` |

## Outputs

| Output | Description |
|--------|-------------|
| `fnpack-path` | Path to the installed fnpack binary |

## Supported platforms

- Linux x86_64
- Linux ARM64
- macOS Intel
- macOS Apple Silicon
- Windows x86_64
