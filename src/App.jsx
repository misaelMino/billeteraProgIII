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
  // Intenta cargar usuario y token desde localStorage si existen
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [totpToken, setTotpToken] = useState(() => {
    return localStorage.getItem('totpToken') || '';
  });

  const handleLoginSuccess = (usuario, token) => {
    setUsuarioLogueado(usuario);
    setTotpToken(token);

    // Guardar en localStorage
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('totpToken', token);
  };

  const handleActualizarUsuario = (nuevoUsuario, nuevoToken) => {
    setUsuarioLogueado(nuevoUsuario);
    setTotpToken(nuevoToken);
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
    localStorage.setItem('totpToken', nuevoToken);
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
                  <Account
                    usuario={usuarioLogueado}
                    totpToken={totpToken}
                    onActualizarUsuario={handleActualizarUsuario}
                  />
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
