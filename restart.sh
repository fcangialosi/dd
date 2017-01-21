#!/bin/bash

echo "===> Stop server"
forever stop app.js
echo "===> Update assets version"
./update-assets.sh
echo "===> Rebuild"
grunt prod
echo "===> Restarting server"
forever start app.js
echo "===> DONE!"
