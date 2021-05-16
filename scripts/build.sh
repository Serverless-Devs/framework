#!/bin/bash
set -e

# cp ./README.md ./packages/midway/README.md
lerna exec -- rm -rf ./libs
lerna run build
