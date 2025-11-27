# Build Stage
FROM node:22.12.0-alpine AS builder

# This creates a folder *inside the container*.
# It does NOT require you to have an /app folder in your project.
WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your Vite project
COPY . .

# Build the Vite production files
RUN npm run build


# ----------- Production Stage -----------
FROM node:22.12.0-alpine AS runner

WORKDIR /app

# Install a simple static server
RUN npm install -g serve

# Copy build output from previous stage
COPY --from=builder /app/dist ./dist

# Expose port for Coolify
EXPOSE 3000

# Start server
CMD ["serve", "-s", "dist", "-l", "3000"]
