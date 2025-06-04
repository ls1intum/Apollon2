#!/bin/bash
set -e

LIB_DIR="library"
cd "$LIB_DIR"

echo "📦 Bumping patch version and preparing PR"

# 1. bump version (no tag/commit)
new_version=$(npm version prepatch --no-git-tag-version --preid=alpha)
echo "New version: $new_version"

# 2. build
npm run build
npm publish --access public --tag latest


# 4. create a sanitized branch name
# Remove @tumaet/apollon prefix and invalid characters, replace spaces and slashes
sanitized_version=$(echo "$new_version" | sed 's/@tumaet\/apollon//g' | sed 's/[^a-zA-Z0-9.-]/-/g')
branch_name="chore/version-bump-patch-${sanitized_version}"
git checkout -b "$branch_name"

# 5. add and commit changes
git add package.json package-lock.json dist/
git commit -m "chore: bump patch version to $new_version"

# 6. push branch
git push -u origin "$branch_name"

# 7. suggest PR URL
repo_url=$(git config --get remote.origin.url | sed 's/.git$//' | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's#^git://#https://#')
pr_url="${repo_url}/compare/main...${branch_name}?expand=1"

echo ""
echo "🔗 PR ready to be created:"
echo "$pr_url"
echo ""
echo "👉 Click the link above or paste it in your browser to create a pull request."
