#!/bin/bash

# Exit on error
set -e

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Create netlify/functions directory if it doesn't exist
mkdir -p netlify/functions

# Make the build script executable
chmod +x build.sh 