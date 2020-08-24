<h1 align="center">prepare action for GitHub</h2>

<p align="center">
  <a href="https://github.com/satoruk/action-prepare/actions?query=workflow%3ATest"><img src="https://github.com/satoruk/action-prepare/workflows/Test/badge.svg" height="20"/></a>
  <a href="https://codecov.io/gh/satoruk/action-prepare"><img src="https://codecov.io/gh/satoruk/action-prepare/branch/master/graph/badge.svg" height="20"/></a>
</p>

## Usage

to prepare any environment variables and any files.

### `.github/workflows/sample.yml`

```yaml
name: Sample
on: push
steps:
  - uses: actions/checkout@v2
  - uses: satoruk/action-prepare
    with:
      config-file: examples/demo.yml
```

### `examples/demo.yml`

```yaml
env:
  FOO_TOKEN: DUMMY_TOKEN
file:
  examples/dummy1.json: |
    {
      "dummy": "dummy122"
    }
```
