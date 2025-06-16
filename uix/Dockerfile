FROM node:20.13.1 

RUN apt-get update && apt-get install -y \
    libgtk-3-dev \
    libnotify-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    libx11-dev \
    libxkbfile-dev \
    fakeroot \
    dpkg \
    rpm \
    xz-utils \
    python3 \
    git \
    libfuse2 \
    libc6 \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production
