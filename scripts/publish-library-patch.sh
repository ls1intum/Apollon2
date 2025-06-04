#!/bin/bash
set -e

LIB_DIR="library"

echo "📦 Publishing patch version of @tumaet/apollon"

cd "$LIB_DIR"

npm version prepatch --no-git-tag-version --preid=alpha
npm run build
npm publish --access public

echo "✅ Patch version published: $(jq -r .version package.json)"
