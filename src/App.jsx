import './App.css';
import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Login from './components/Login';
import Register from './components/Register';
import Totp from './components/Totp';
import Account from './components/Account';
import VerifyAccount from './components/VerifyAccount';
import Transferir from './components/Transferencia';

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [totpToken, setTotpToken] = useState('');

  const handleLoginSuccess = (usuario, token) => {
    setUsuarioLogueado(usuario);  // ej: { username, name, balance }
    setTotpToken(token);          // ej: '123456'
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#222', borderRadius: 5 } }}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/totp" element={<Totp />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route
              path="/account"
              element={
                usuarioLogueado ? (
                  <Account usuario={usuarioLogueado} totpToken={totpToken} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/transferir"
              element={
                usuarioLogueado ? (
                  <Transferir username={usuarioLogueado.username} totpToken={totpToken} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}


export default App;
