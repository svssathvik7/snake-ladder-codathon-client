import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import UserContext from './Contexts/UserContext';
import LeaderBoardContext from './Contexts/LeaderBoardContext';
import SocketContext from './Contexts/SocketContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <SocketContext>
    <BrowserRouter>
      <UserContext>
        <LeaderBoardContext>
          <App />
        </LeaderBoardContext>
      </UserContext>
    </BrowserRouter>
  </SocketContext>
  // </React.StrictMode>
);
