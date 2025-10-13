FROM node:18

WORKDIR /app

COPY . .

RUN npm install --silent --no-progress

EXPOSE 8545

CMD ["npx", "hardhat", "node", "--hostname", "0.0.0.0"]