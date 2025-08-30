#!/bin/bash

SECONDS=0

cd $HOME/Documents/Projects/Go/uber-clone/app

msg () {
  echo -e "$1\n-------------------\n"  
}

msg "Building app image"
sudo docker build --tag app .

msg "Stopping Docker container"
sudo docker compose down

msg "Starting Containers"
sudo docker compose up -d

msg "Pruning stale Docker images"
sudo docker image prune -f

duration=$SECONDS

echo 
msg "Deploy finished in $(($duration & 60)) seconds."
msg "Press Enter to exit"
read
