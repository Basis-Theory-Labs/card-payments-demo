ARG node_image=node:14-alpine3.16

# STAGE 1
FROM $node_image as builder

ARG USE_DEFAULT_SESSION
ENV USE_DEFAULT_SESSION=$USE_DEFAULT_SESSION
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app/

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --no-progress --ignore-scripts

COPY next.config.js ./
COPY tsconfig.json ./
COPY public ./public/
COPY types ./types/
COPY stripe_migration_data.json ./
COPY server ./server/
COPY pages ./pages/
COPY components ./components/

RUN yarn build

# STAGE 2 -- useful if we don't want to include dependencies that
# are used as apart of the build process
FROM $node_image as production

ARG USE_DEFAULT_SESSION
ENV USE_DEFAULT_SESSION=$USE_DEFAULT_SESSION

WORKDIR /app/

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production --no-progress --ignore-scripts

# STAGE 3
FROM $node_image

RUN apk update && apk upgrade

RUN npm uninstall npm -g

ARG USE_DEFAULT_SESSION
ENV USE_DEFAULT_SESSION=$USE_DEFAULT_SESSION
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app/

COPY --from=production /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD yarn start