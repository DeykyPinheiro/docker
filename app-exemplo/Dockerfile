from node:14
workdir /app
arg port_build=6000
env port=$port_build
expose $port_build
copy . .
run npm install
entrypoint npm start