VERSION_STORE=current_version
OLD_VERSION=$(cat $VERSION_STORE | xargs)
NEW_VERSION=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

rm $VERSION_STORE
echo -n $NEW_VERSION >> $VERSION_STORE

echo "Old version was $OLD_VERSION"
echo "New version is $NEW_VERSION"

find .tmp/public/min -type f -name production* -delete
sed -i "s/$OLD_VERSION/$NEW_VERSION/g" Gruntfile.js

