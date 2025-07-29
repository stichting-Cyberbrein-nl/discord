FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY src/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ .

# Create config directory for compatibility
RUN mkdir -p config

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "index.js"]
