#!/usr/bin/env bash

# delete unused dirs
rm -rf "dist/assets"
rm -rf "dist/images"
rm -rf "dist/fonts"
rm "dist/style.css"
rm -rf "dist/types/common"

cp dist-umd/pixie.umd.js dist
cp dist-umd/pixie.umd.js.map dist
rm -rf dist-umd

# TODO: https://github.com/vitejs/vite/pull/6838
sed -i '' 's/React.createElement/ce.createElement/g' "dist/pixie.umd.js"
sed -i '' 's/React.Fragment/ce.Fragment/g' "dist/pixie.umd.js"
sed -i '' 's/React.createElement/React__default.createElement/g' "dist/pixie.es.js"
sed -i '' 's/React.Fragment/React__default.Fragment/g' "dist/pixie.es.js"

PIXIE_PATH="./../landing/local_modules/pixie";

# empty previous
rm -rf "$PIXIE_PATH"
mkdir "$PIXIE_PATH"

# copy over editor lib to landing
cp -r dist "$PIXIE_PATH/dist"
cp package.json "$PIXIE_PATH"

# move assets to public dir
cp -r "assets/." "./../landing/static/pixie"

