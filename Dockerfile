FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

# Bundle app source
COPY . .

# Build app
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start app
CMD [ "pnpm", "start" ]

