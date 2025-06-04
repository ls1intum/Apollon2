#!/bin/bash
set -e

LIB_DIR="library"

echo "📦 Publishing preminor version of @tumaet/apollon"

cd "$LIB_DIR"

npm version preminor --no-git-tag-version --preid=alpha
npm run build
npm publish --access public

echo "✅ Minor version published: $(jq -r .version package.json)"