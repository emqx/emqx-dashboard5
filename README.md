# The New Dashboard for EMQX 5.0

## Project setup

```shell
yarn install
```

### Compiles and hot-reloads for development

```shell
yarn serve
```

### Compiles and minifies for production

```shell
yarn build
```

### Run your unit tests

```shell
yarn test:unit
```

### Lints and fixes files

```shell
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Release

If it is not a patch version, it needs to be released on the `master` branch

```shell
git checkout master

git pull origin master --rebase

git tag $tag_version

git push $tag_version
```

The CI will then run automatically, and it will be released after the run is complete.
