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
