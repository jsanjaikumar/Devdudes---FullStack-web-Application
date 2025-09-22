import React from 'react'
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import Body from './components/Body'
import Login from './components/Login';
import Profile from "./components/Profile";
import { Provider } from 'react-redux';
import appStore from './utils/appStore';
import Feed from "./components/Feed";
import Connections from './components/Connections';
import Requests from './components/Requests';
import Premium from './components/Premium';
import Chat from './components/Chat';
import ResetPassword from './components/ResetPassword';
import Messages from './components/Messages';
import OtpVerify from './components/OtpVerify';

const App = () => {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/verify-otp" element={<OtpVerify />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App