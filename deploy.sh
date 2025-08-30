#!/bin/bash

cd frontend
npm run build
cd ..
git add .
git commit -m "build"
git push
sshcmd="ssh -t deek@app.deekshith.me"
$sshcmd screen -S "deployment" /home/deek/app/prod_deploy.sh 
