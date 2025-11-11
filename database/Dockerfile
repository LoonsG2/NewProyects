FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY init.js ./
COPY mongo-init.js ./

RUN npm install mongoose dotenv

ENV NODE_ENV=production
ENV MONGODB_URI=mongodb://mongodb:27017/hotel_reservations

VOLUME /app/data

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('mongoose').connect('$MONGODB_URI').then(() => process.exit(0)).catch(() => process.exit(1))"

CMD ["node", "init.js"]