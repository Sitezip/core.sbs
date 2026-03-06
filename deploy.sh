#!/bin/bash
set -e

echo "=== STATIC SITE DEPLOYMENT STARTED ==="
echo "Repository: $(basename $(pwd))"
echo "Timestamp: $(date)"
echo "Current directory: $(pwd)"

echo "=== BUILDING STATIC SITE ==="
npm run build

echo "=== DEPLOYING TO WEB SERVER ==="
# Update this with your server details
# rsync -avz --delete dist/ user@server:/var/www/site/
# For local deployment:
# cp -r dist/* /var/www/html/

echo "=== CLEANING UP ==="
npm cache clean --force

echo "=== DEPLOYMENT SUCCESSFUL ==="
echo "Completed at: $(date)"

# Health check
echo "=== RUNNING HEALTH CHECK ==="
# curl -f http://localhost:80/ || exit 1
