#!/usr/bin/env bash

source ./scripts/utils.sh

dps "Building..."
yarn run build
ec "Successfully built!" "Failed to build!"

dps "Serving"
./scripts/serve.js
ec "Successfully served!" "Failed to serve!"
