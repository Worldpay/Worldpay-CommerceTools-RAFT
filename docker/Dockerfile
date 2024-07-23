FROM node:18

ENV WORKING_DIR /app

RUN mkdir -p ${WORKING_DIR}
WORKDIR ${WORKING_DIR}
ADD ../packages ./packages
ADD ../worldpay-raft-connect ./worldpay-raft-connect

WORKDIR ${WORKING_DIR}/worldpay-raft-connect
RUN npm install
RUN npm run build

CMD npm run start
