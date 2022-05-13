yarn workspace types build
yarn workspace extension build
yarn workspace frontend build
yarn workspace backend build
cd packages/backend
rm -rf dist
cp -r ../frontend/dist .