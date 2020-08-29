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
  - uses: satoruk/action-prepare@v1.4.0
    with:
      config_file: examples/demo.yml
```

#### `examples/demo.yml`

```yaml
env:
  # To be a masked environment variable
  DUMMY1_TOKEN: DUMMY1_TOKEN_VALUE
  # To be a environment variable(no mask)
  DUMMY1_NO_SECRET_TOKEN:
    value: DUMMY1_NO_SECRET_TOKEN_VALUE
    secret: false
  DUMMY1_HOME:
    # To use any environment variables at value
    value: ${HOME}
    secret: false
file:
  examples/dest/dummy1.json: |
    {
      "dummy": "dummy1_1"
    }
  # To use any environment variables and absolute path
  ${HOME}/dest/dummy1_${GITHUB_SHA}.json: |
    {
      "dummy": "dummy1_2"
    }
mask:
  - MASK_VALUE1
  # To use any environment variables
  - ${GITHUB_REPOSITORY}
```

### With GPG encrypt

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
  - uses: satoruk/action-prepare@v1.4.0
    with:
      config_file: examples/demo.yml.gpg
      gpg_passphrase: ${{ secrets.YOUR_PASSPHRASE }}
```
