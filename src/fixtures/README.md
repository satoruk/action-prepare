## To encrypt

```shell
gpg --batch --cipher-algo AES256 --compress-algo zlib --symmetric --yes --passphrase 'secret stuff' \
  "${target_file}"
```

## To decrypt

```shell
gpg --batch --decrypt --quiet --yes --passphrase 'secret stuff' "${target_file}"
```
