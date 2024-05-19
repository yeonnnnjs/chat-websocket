IS_WEBSOCKET=$1

if [[ "$IS_WEBSOCKET" == "true" ]]; then
  CLIENT_ENV_CONTENT="REACT_APP_IS_WEBSOCKET=true"
  SERVER_ENV_CONTENT="IS_WEBSOCKET=true"
elif [[ "$IS_WEBSOCKET" == "false" ]]; then
  CLIENT_ENV_CONTENT="REACT_APP_IS_WEBSOCKET=false"
  SERVER_ENV_CONTENT="IS_WEBSOCKET=false"
else
  echo "Usage: ./script.sh [true|false]"
  exit 1
fi

CLIENT_FOLDER_PATH="/client"
SERVER_FOLDER_PATH="/server"

create_env_file() {
  if [ -f "./server/.env" ]; then
    rm "./server/.env"
    echo "Deleted existing .env file in server"
  fi

  if [ -f "./client/.env" ]; then
    rm "./client/.env"
    echo "Deleted existing .env file in client"
  fi
  
  echo "$SERVER_ENV_CONTENT" >> "./server/.env"
  echo "$CLIENT_ENV_CONTENT" >> "./client/.env"
  echo "Created .env file in server and client"
}

create_env_file

echo "Installing dependencies and starting server..."
cd server
npm install
npm start &
SERVER_PID=$!

echo "Installing dependencies and starting client..."
cd ../client
npm install
npm start &
CLIENT_PID=$!

cleanup() {
  echo "Stopping server and client..."
  kill $SERVER_PID
  kill $CLIENT_PID
}

trap cleanup EXIT

wait $SERVER_PID
wait $CLIENT_PID