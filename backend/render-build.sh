#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
# Store/pull Puppeteer cache with build cache
PUPPETEER_CACHE_DIR=/opt/render/project/puppeteer

echo "Starting Render Build..."
# Ensure the cache dir exists
mkdir -p $PUPPETEER_CACHE_DIR

# Run the puppeteer install script to fetch chrome specifically
echo "Installing Puppeteer Chrome Binaries..."
# Log the result of the installation
INSTALL_LOG=$(PUPPETEER_CACHE_DIR=$PUPPETEER_CACHE_DIR npx puppeteer browsers install chrome)
echo "Installation output: $INSTALL_LOG"

# Try to find exactly where chrome was installed to help debug
find $PUPPETEER_CACHE_DIR -name chrome -type f || echo "Chrome binary not found yet"

echo "Build complete."
