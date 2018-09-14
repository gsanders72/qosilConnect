FROM node:10

# Create app directory
WORKDIR /usr/src/QosilConnect

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY . .

# Environment variables
ENV TW_CONS_KEY hszpAJoOW9CzPG5k1p63PQ19V
ENV TW_CONS_SECRET wiR1ZAe8cVIKi1CRhoSFseYGmZiVsKg5awOvGMlaHOKnmhojeZ
ENV FB_APP_ID 2155893234681000
ENV FB_APP_SECRET f4ff695743866e786c048a73334e9318
ENV MONGODB_CNXN_STRING mongodb://qosilDbSvc:VIkWeQuidveghi7@ds018258.mlab.com:18258/qosilconnect
ENV SESSION_SECRET "SwHwLwA 7863"
CMD ["npm", "start"]

EXPOSE 7863
