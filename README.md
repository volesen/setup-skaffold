# setup-skaffold

[![GitHub Actions status](https://github.com/volesen/setup-skaffold/workflows/build-test/badge.svg)](https://github.com/volesen/setup-skaffold/actions?query=workflow%3Abuild-test)

This action installs the tool [Skaffold](https://github.com/GoogleContainerTools/skaffold) by:

- downloading and caching a version of skaffold by version spec and add to PATH

## Inputs

### `version`

**Required** Skaffold version to use. Default `"latest"`.

## Example usage

```yaml
uses: volesen/setup-skaffold@v1.1
with:
  version: 'v1.17.0'

run: skaffold run
```
