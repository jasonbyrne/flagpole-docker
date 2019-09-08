FROM node:10-slim

# Install Puppeteer Deps
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install puppeteer so it's available in the container.
RUN npm i puppeteer \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && mkdir -p /home/pptruser/node_modules \
    && chown -R pptruser:pptruser /home/pptruser/node_modules

# Install application
WORKDIR /home/pptruser
RUN npm i -g flagpole
COPY package*.json ./
USER pptruser
RUN npm i
COPY --chown=pptruser:pptruser . .

# Expose port and file to run
EXPOSE 8080
CMD ["node", "dist/server.js"]
