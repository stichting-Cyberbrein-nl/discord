FROM node:20-alpine

# Set build arguments for better logging
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

# Add labels for better image management
LABEL maintainer="Discord Bot Dashboard" \
      org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.version=$VERSION \
      org.label-schema.description="Discord Bot Dashboard V2"

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY src/package*.json ./

# Install dependencies with verbose logging
RUN echo "🔧 Installing Node.js dependencies..." && \
    npm install --verbose && \
    echo "✅ Dependencies installed successfully"

# Copy source code
RUN echo "📁 Copying source code..." && \
    echo "📂 Current directory: $(pwd)" && \
    echo "📂 Contents: $(ls -la)"

COPY src/ .

# Create config directory for compatibility
RUN echo "📁 Creating config directory..." && \
    mkdir -p config && \
    echo "✅ Config directory created"

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Add build information
RUN echo "🏗️ Build Information:" && \
    echo "  - Node.js version: $(node --version)" && \
    echo "  - NPM version: $(npm --version)" && \
    echo "  - Working directory: $(pwd)" && \
    echo "  - Application files:" && \
    ls -la && \
    echo "  - Config directory:" && \
    ls -la config/ 2>/dev/null || echo "    (config directory is empty)"

# Health check with better logging

# Start the application with better error handling
CMD echo "🚀 Starting Discord Bot Dashboard..." && \
    echo "📊 Environment:" && \
    echo "  - NODE_ENV: $NODE_ENV" && \
    echo "  - PORT: $PORT" && \
    echo "  - DISCORD_CLIENT_ID: ${DISCORD_CLIENT_ID:-'NOT SET'}" && \
    echo "  - DISCORD_CALLBACK_URL: ${DISCORD_CALLBACK_URL:-'NOT SET'}" && \
    echo "  - DISCORD_ADMIN_IDS: ${DISCORD_ADMIN_IDS:-'NOT SET'}" && \
    echo "  - DISCORD_BOT_TOKEN: ${DISCORD_BOT_TOKEN:-'NOT SET'}" && \
    echo "📁 Working directory: $(pwd)" && \
    echo "📁 Application files:" && \
    ls -la && \
    echo "🎯 Starting application..." && \
    node index.js
