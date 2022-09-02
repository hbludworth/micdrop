yarn build
cd packages/backend
zip -q -r micdrop-build.zip build dist package.json yarn.lock .platform fonts
mv micdrop-build.zip ../..
cd ../..
mkdir micdrop-build
unzip micdrop-build.zip -d ./micdrop-build
cd micdrop-build
yarn install
npm rebuild --platform=linux --arch=arm64 sharp
zip -q -r micdrop-build.zip build dist package.json yarn.lock .platform node_modules fonts
mv micdrop-build.zip ../
cd ..
rm -rf micdrop-build