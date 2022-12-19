#!/bin/bash
set -e

docker run \
  -p 3000:3000 \
  --name card-payments \
  -dt card-payments