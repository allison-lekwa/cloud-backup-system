# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.17.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js/Prisma"

# Node.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential openssl pkg-config python-is-python3

# Install node modules
COPY --link package-lock.json package.json ./
RUN yarn install --frozen-lockfile --production=false

# Generate Prisma Client
RUN npm config set proxy http://domain:8080
# RUN npm config set https-proxy null
# RUN npm config set registry https://registry.npmjs.org

COPY --link src/prisma .
RUN npx prisma generate

# Copy application code
COPY --link . .

# Build application
RUN yarn run build

# Remove development dependencies
RUN yarn install --production


# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application 
COPY --from=build /app /app

# Entry point prepares the database.
# ENTRYPOINT [ "/src/app/docker-entrypoint.ts" ]

COPY .env .env

# Start the server by default, this can be overwritten at runtime
EXPOSE 3001
CMD [ "yarn", "run", "start:dev" ]
