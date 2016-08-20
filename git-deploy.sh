#!/bin/bash

echo "===> Stop server"
forever stop app.js
echo "===> Pull new changes from git"
git checkout views/layout.ejs
git pull
echo "===> Update assets version"
./update-assets.sh
echo "===> Rebuild"
grunt prod
echo "===> Restarting server"
forever start app.js
echo "===> DONE!"
