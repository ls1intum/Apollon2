#!/bin/bash
set -e

LIB_DIR="library"
cd "$LIB_DIR"

echo "📦 Bumping minor version and preparing PR"

# 1. Bump version (no tag/commit)
npm version preminor --no-git-tag-version --preid=alpha > /dev/null
new_version=$(node -p "require('./package.json').version")
echo "New version: $new_version"

# 2. Build and publish
npm run build > /dev/null
npm publish --access public --tag latest 

# 3. Create a branch
branch_name="chore/version-bump-minor-${new_version}"
git checkout -b "$branch_name"

# 4. Add and commit changes
# Add package.json from the library directory
# Add package-lock.json from the root directory
files_to_add="package.json"
root_package_lock="../package-lock.json"
if [ -f "$root_package_lock" ]; then
  files_to_add="$files_to_add $root_package_lock"
else
  echo "Warning: $root_package_lock not found in root directory"
fi
git add $files_to_add
git commit -m "chore: bump minor version to $new_version"

echo "✅ Changes committed to branch: $branch_name"

# 5. Push branch
git push -u origin "$branch_name"

# 6. Suggest PR URL
repo_url=$(git config --get remote.origin.url | sed 's/.git$//' | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's#^git://#https://#')
pr_url="${repo_url}/compare/main...${branch_name}?expand=1"

echo ""
echo "🔗 PR ready to be created:"
echo "$pr_url"
echo ""
echo "👉 Click the link above or paste it in your browser to create a pull request."