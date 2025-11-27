# ---------- BUILD STAGE ----------
    FROM node:22.12.0 AS builder

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    RUN npm run build
    
    
    # ---------- PRODUCTION STAGE ----------
    FROM node:22.12.0 AS runner
    
    WORKDIR /app
    
    # Use a stable static server
    RUN npm install -g http-server
    
    COPY --from=builder /app/dist ./dist
    
    EXPOSE 3000
    
    # Bind explicitly to 0.0.0.0 (fix for Coolify)
    CMD ["http-server", "dist", "--port", "3000", "--host", "0.0.0.0"]
    