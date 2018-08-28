#!/usr/bin/env bash

PLUGIN_VERSION="$(node -e 'console.log(require("./package.json").version)')"

npm run build

git add dist/

git commit -m "build $PLUGIN_VERSION"
