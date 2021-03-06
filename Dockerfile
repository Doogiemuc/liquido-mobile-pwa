##### THIS IS OUTDATED / HAS NEVER BEEN USED YET ... but planning to :-)  ... one day ....

# ---- Base Node ----
FROM node:13.8.0-alpine AS BASE
WORKDIR /app

# ---- Dependencies ----
FROM BASE AS dependencies  
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# ---- Copy Files/Build ----
FROM dependencies AS build  
WORKDIR /app
COPY ./ /app
RUN yarn run build

# --- Release ----
FROM BASE AS release  

COPY --from=build /app/server ./
COPY --from=build /app/dist ./

RUN yarn global add pm2 && \
    yarn add express compression connect-history-api-fallback helmet

RUN addgroup -S nodejs && adduser -S -G nodejs nodejs
USER nodejs

CMD ["pm2-docker", "/app/process.yml", "--web", "--json"]