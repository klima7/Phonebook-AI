FROM node:20-alpine

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Expose default React dev server port
EXPOSE 3000

COPY . .

# Set development command with auto-reload
CMD npm run dev -- --host 0.0.0.0 --port 3000

# Note: App code will be mounted as a volume
# Run with: docker run -p 3000:3000 -v $(pwd):/app image_name