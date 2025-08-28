#!/bin/bash

SECONDS=0

cd $HOME/app

msg () {
  echo -e "$1\n-------------------\n"
}

msg "Stopping app"
sudo pkill app

msg "Pulling from Github"
git pull

msg "Building Go binary"
go build

msg "Starting Server"
nohup sudo ./app &>/dev/null &

duration=$SECONDS

echo 
msg "Deploy finished in $(($duration & 60)) seconds."
msg "Press Enter to exit"
read
