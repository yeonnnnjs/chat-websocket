import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SocketContext, socket } from './Context/socketContext';
import Main from './Main/Main';
import Chat from "./Chat/Chat";

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route path='/' Component={Main} />
        <Route path='/chat/:roomName' Component={Chat}/>
      </Routes>
    </SocketContext.Provider>
  );
}

export default App;
