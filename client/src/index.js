import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainWebSocket from "./Main/MainWebSocket";
import MainSSE from "./Main/MainSSE";
import ChatWebSocket from "./Chat/ChatWebSocket";
import ChatSSE from "./Chat/ChatSSE";
import { SocketProvider } from "./Context/socketContext";

const isWebSocket = process.env.REACT_APP_IS_WEBSOCKET === "true";
console.log(`Chat client running with ${isWebSocket ? "WebSocket" : "SSE"}`);

const Main = isWebSocket ? MainWebSocket : MainSSE;
const Chat = isWebSocket ? ChatWebSocket : ChatSSE;
const Context = (children) =>
  isWebSocket ? <SocketProvider>{children}</SocketProvider> : <>{children}</>;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  Context(
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Main} />
        <Route path="/chat/:roomName" Component={Chat} />
      </Routes>
    </BrowserRouter>,
  ),
);
