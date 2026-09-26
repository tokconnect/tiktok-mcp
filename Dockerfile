FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY cli.js connector.js ./
USER node
ENTRYPOINT ["node", "cli.js"]
