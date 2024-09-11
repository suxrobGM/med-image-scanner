#!/bin/bash
# setup.sh

# Install Python dependencies
pip install -r requirements.txt

# System dependencies
sudo apt-get update
sudo apt-get install -y xvfb
