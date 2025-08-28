#!/bin/bash

sshcmd="ssh -t deek@app.deekshith.me"
$sshcmd screen -S "deployment" /home/deek/app/prod_deploy.sh 
