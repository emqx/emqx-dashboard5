# new-emqx

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Release
If it is not a patch version, it needs to be released on the `master` branch


```shell
git tag tagVersion
git push tagVersion
```

The CI will then run automatically, and it will be released after the run is complete.
