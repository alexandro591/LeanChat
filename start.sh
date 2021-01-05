DIR="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

cd "${DIR}/Server"
npm install
pm2 start main.js --name "LeanChatServer"

cd "${DIR}/ChatApp"
npm install
pm2 start ./bin/www --name "LeanChatApp"

cd "./public/app"
npm run build

pm2 startup
pm2 save