#!/bin/bash

# Discord Bot Dashboard Build Script
# Enhanced logging for Docker builds

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Build information
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VCS_REF=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
VERSION="3.0"

log_info "🚀 Starting Discord Bot Dashboard Build"
log_info "📅 Build Date: $BUILD_DATE"
log_info "🔗 VCS Reference: $VCS_REF"
log_info "📦 Version: $VERSION"

# Check prerequisites
log_info "🔍 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed or not in PATH"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed or not in PATH"
    exit 1
fi

log_success "Prerequisites check passed"

# Check if source files exist
log_info "📁 Checking source files..."

if [ ! -f "src/package.json" ]; then
    log_error "src/package.json not found"
    exit 1
fi

if [ ! -f "src/index.js" ]; then
    log_error "src/index.js not found"
    exit 1
fi

if [ ! -f "src/bot.js" ]; then
    log_error "src/bot.js not found"
    exit 1
fi

log_success "Source files check passed"

# Show build context
log_info "📂 Build context:"
echo "  - Dockerfile: $(ls -la Dockerfile)"
echo "  - docker-compose.yml: $(ls -la docker-compose.yml)"
echo "  - src/ directory:"
ls -la src/ | head -10

# Build arguments
BUILD_ARGS="--build-arg BUILD_DATE=$BUILD_DATE --build-arg VCS_REF=$VCS_REF --build-arg VERSION=$VERSION"

# Build the Docker image
log_info "🏗️ Building Docker image..."
log_info "Build arguments: $BUILD_ARGS"

if docker build $BUILD_ARGS -t discord-bot-dashboard .; then
    log_success "Docker image built successfully"
else
    log_error "Docker build failed"
    exit 1
fi

# Show image information
log_info "📊 Image information:"
docker images discord-bot-dashboard --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

# Test the build
log_info "🧪 Testing the build..."

# Create a test container
TEST_CONTAINER=$(docker create discord-bot-dashboard)

if [ $? -eq 0 ]; then
    log_success "Test container created successfully"
    
    # Check if index.js exists in container
    if docker exec $TEST_CONTAINER test -f /usr/src/app/index.js; then
        log_success "index.js found in container"
    else
        log_error "index.js not found in container"
    fi
    
    # Check if package.json exists in container
    if docker exec $TEST_CONTAINER test -f /usr/src/app/package.json; then
        log_success "package.json found in container"
    else
        log_error "package.json not found in container"
    fi
    
    # Clean up test container
    docker rm $TEST_CONTAINER > /dev/null
    log_success "Test container cleaned up"
else
    log_error "Failed to create test container"
    exit 1
fi

# Show final summary
log_success "🎉 Build completed successfully!"
log_info "📋 Next steps:"
echo "  1. Run with Docker Compose: docker-compose up -d"
echo "  2. View logs: docker-compose logs -f"
echo "  3. Access dashboard: http://localhost:3000"
echo "  4. For Dokploy: Use the built image with environment variables"

# Optional: Show environment variables template
log_info "🔧 Environment variables for Dokploy:"
echo "DISCORD_CLIENT_ID=your_client_id"
echo "DISCORD_CLIENT_SECRET=your_client_secret"
echo "DISCORD_BOT_TOKEN=your_bot_token"
echo "DISCORD_CALLBACK_URL=https://your-domain.com/login/api"
echo "DISCORD_ADMIN_IDS=your_admin_user_id"
echo "BOT_PREFIX=-"
echo "BOT_PORT=3000"
echo "SESSION_SECRET=your_session_secret"
echo "NODE_ENV=production" 