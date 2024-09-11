#!/bin/bash

# Start abdominal_organs_server.py
echo "Starting abdominal_organs_server.py..."
nohup python3 abdominal_organs_server.py > abdominal_organs_server.log 2>&1 &

# Start brain_mri_server.py
echo "Starting brain_mri_server.py..."
nohup python3 brain_mri_server.py > brain_mri_server.log 2>&1 &

# Start chest_ct_server.py
echo "Starting chest_ct_server.py..."
nohup python3 chest_ct_server.py > chest_ct_server.log 2>&1 &

# Start llm_server.py
echo "Starting llm_server.py..."
nohup python3 llm_server.py > llm_server.log 2>&1 &

# Start xray_server.py
echo "Starting xray_server.py..."
nohup python3 xray_server.py > xray_server.log 2>&1 &

echo "All servers have been started."

# List running processes for verification
ps aux | grep python3
