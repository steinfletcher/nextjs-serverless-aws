#!/usr/bin/env bash

# prep build dir
rm -rf build
mkdir -p build

# run nextjs build
npm run build

# copy artifacts to build dir
cp lambda/handler.js build
cp lambda/index.js build
cp -r lambda/node_modules build
cp -r .next build # TODO this should go in S3

# create lambda deployment archive
cd build || exit
zip -r function.zip .
cd ..
