#!/bin/sh
set -e

echo "=== Installing dependencies ==="
npm install

echo "=== Building client ==="
npm run build --workspace=@video-portfolio/client

echo "=== Copying dist to root ==="
rm -rf dist
cp -r apps/client/dist dist

echo "=== Build complete. Contents of dist: ==="
ls dist/
