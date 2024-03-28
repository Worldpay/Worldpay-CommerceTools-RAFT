FROM node:18

ENV WORKING_DIR /app

RUN mkdir -p ${WORKING_DIR}
WORKDIR ${WORKING_DIR}
ADD ../packages ./packages
ADD ../worldpay-raft-connector ./worldpay-raft-connector

WORKDIR ${WORKING_DIR}/worldpay-raft-connector
RUN npm install
RUN npm run build

CMD npm run start
