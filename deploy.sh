#!/bin/sh

# If a command fails then the deploy stops
set -e

if ! command -v hugo 2>/dev/null; then
  echo "install hugo: https://github.com/gohugoio/hugo/releases"
  exit 1
fi

printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"

# Build the project.
hugo -t smol # if using a theme, replace with `hugo -t <YOURTHEME>`

git add .

# Commit changes.
msg="rebuilding site $(date)"
if [ -n "$*" ]; then
	msg="$*"
fi
git commit -m "$msg"

# Push source and build repos.
git push origin master
