FROM node:12.3.1-alpine

ENV SERVICE_USER=app
ENV APP_DIR=/home/$SERVICE_USER/feh-voting-gauntlet-weaker-norifier

RUN adduser -D -g '' $SERVICE_USER
ADD --chown=app:app . $APP_DIR

WORKDIR $APP_DIR
USER $SERVICE_USER

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
