<h1 align="center">prepare action for GitHub</h2>

<p align="center">
  <a href="https://github.com/satoruk/action-prepare/actions?query=workflow%3ATest"><img src="https://github.com/satoruk/action-prepare/workflows/Test/badge.svg" height="20"/></a>
  <a href="https://codecov.io/gh/satoruk/action-prepare"><img src="https://codecov.io/gh/satoruk/action-prepare/branch/master/graph/badge.svg" height="20"/></a>
</p>

## Usage

To prepare any environment variables and any files.

### To use YAML config file

#### `.github/workflows/sample.yml`

```yaml
name: Sample
on: push
steps:
  - uses: actions/checkout@v2
  - uses: satoruk/action-prepare
    with:
      config_file: examples/demo.yml
```

#### `examples/demo.yml`

```yaml
env:
  DUMMY1_TOKEN: DUMMY1_TOKEN_VALUE
  DUMMY1_SECRET_TOKEN:
    value: DUMMY1_SECRET_TOKEN_VALUE
    secret: true
file:
  examples/dummy1.json: |
    {
      "dummy": "dummy122"
    }
mask:
  - MASK_VALUE1
```

### To use YAML config file with GPG encrypt

If you want to use encrypted config file, encrypt to your config file on your git repository.

To encrypt sample command below.

```shell
gpg \
  --batch \
  --cipher-algo AES256 \
  --compress-algo zlib \
  --passphrase 'secret stuff' \
  --symmetric \
  --yes \
  "/path/to/config.yml"
```

#### `.github/workflows/sample.yml`

```yaml
name: Sample
on: push
steps:
  - uses: actions/checkout@v2
  - uses: satoruk/action-prepare
    with:
      config_file: examples/demo.yml.gpg
      gpg_passphrase: secret stuff
```
