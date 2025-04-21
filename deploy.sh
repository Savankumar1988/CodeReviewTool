#!/bin/bash

# Create deployment package
echo "Creating deployment package..."
tar -czf server-performance-app-docker.tar.gz \
    Dockerfile \
    docker-compose.yml \
    .dockerignore \
    package*.json \
    tsconfig.json \
    vite.config.ts \
    client/ \
    server/ \
    shared/ \
    crypto-polyfill.js \
    crypto-polyfill-dev.cjs

echo "Deployment package created: server-performance-app-docker.tar.gz"
echo ""
echo "=== Deployment Instructions ==="
echo "1. Transfer server-performance-app-docker.tar.gz to your target server"
echo "2. On the target server:"
echo "   a. Extract the package:"
echo "      tar -xzf server-performance-app-docker.tar.gz"
echo "   b. Install Docker if not already installed:"
echo "      curl -fsSL https://get.docker.com -o get-docker.sh"
echo "      sudo sh get-docker.sh"
echo "   c. Build and run the container:"
echo "      sudo docker build -t performance-analysis-app ."
echo "      sudo docker run -d -p 3000:3000 performance-analysis-app"
echo ""
echo "The application will be available at http://[server-ip]:3000"