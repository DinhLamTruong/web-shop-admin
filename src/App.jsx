import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Chat from './Chat/Chat';
import Header from './Header/Header';
import History from './History/History';
import Home from './Home/Home';
import Menu from './Menu/Menu';
import Products from './Products/Products';
import Users from './Users/Users';
import Login from './Login/Login';
import NewProduct from './New/NewProduct';

import { AuthContext } from './Context/AuthContext';
import UpdateProduct from './Update/UpdateProduct';

function App() {
  
  const ProtectRoute = ({ children }) => {
    const { user } = React.useContext(AuthContext);
    if (user?.role !== 'admin') {
      return <Navigate to="/login" />;
    }
    return children;
  };
  return (
    <div className="App">
      <div
        id="main-wrapper"
        data-theme="light"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        data-sidebar-position="fixed"
        data-header-position="fixed"
        data-boxed-layout="full"
      >
        <Header />

        <Menu />

        <Routes>
          <Route
            path="/chat"
            element={
              <ProtectRoute>
                <Chat />
              </ProtectRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectRoute>
                <Users />
              </ProtectRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectRoute>
                <Products />
              </ProtectRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectRoute>
                <History />
              </ProtectRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/new"
            element={
              <ProtectRoute>
                <NewProduct />
              </ProtectRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectRoute>
                <UpdateProduct />
              </ProtectRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectRoute>
                <Home />
              </ProtectRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
