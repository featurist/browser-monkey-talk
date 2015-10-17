from node:4

run mkdir /app
copy package.json /app/
workdir /app
run npm i --production
add server /app/server
add browser /app/browser

expose 4000
volume /app

cmd node server/server.js
