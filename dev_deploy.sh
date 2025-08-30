#!/bin/bash

SECONDS=0

cd $HOME/Documents/Projects/Go/uber-clone/app

msg () {
  echo -e "$1\n-------------------\n"  
}

msg "Building Docker image"
sudo docker build --tag app .

msg "Stopping Docker container"
sudo docker stop app
sudo docker rm app
sudo docker stop db-postgres
sudo docker rm db-postgres


msg "Starting Docker Container"
sudo docker run \
  -d \
  --name app \
  --expose 8080 \
  -p 8080:8080 \
  -e SERVER_ENV=DEV \
  app

msg "Starting Postgres Server"
sudo docker run \
  -d \
  --name db-postgres \
  -p 5432:5432 \
  --mount type=volume,src=app-db,target=/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=mysecretpassword \
  postgres:15.1-alpine

msg "Pruning stale Docker images"
sudo docker image prune -f

duration=$SECONDS

echo 
msg "Deploy finished in $(($duration & 60)) seconds."
msg "Press Enter to exit"
read
