# ██████╗ ██╗   ██╗██╗██╗     ██████╗ 
# ██╔══██╗██║   ██║██║██║     ██╔══██╗
# ██████╔╝██║   ██║██║██║     ██║  ██║
# ██╔══██╗██║   ██║██║██║     ██║  ██║
# ██████╔╝╚██████╔╝██║███████╗██████╔╝
# ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝  Step

# Use node alpine image
FROM node:14-alpine as builder

# Set Workdir
WORKDIR /app

# Copy package list
COPY /package.json .
COPY /yarn.lock .

# Install packages
RUN yarn install --ignore-optional

# Copy content
COPY . .

# Build
RUN yarn build && rm -Rf node_modules && yarn install --production --ignore-optional

# Prune packages
RUN apk add curl && curl -sf https://gobinaries.com/tj/node-prune | sh && node-prune && rm -f /usr/local/bin/node-prune

FROM node:14-alpine as runner

# Set Workdir
WORKDIR /app

# Copy files
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/dist dist

# Run commands
CMD [ "node", "dist/main" ]