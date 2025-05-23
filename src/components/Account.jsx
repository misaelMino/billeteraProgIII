import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import Transferencia from './Transferencia';
import HistorialTransacciones from './HistorialTransacciones';
import ActualizarCuenta from './ActualizarCuenta';

import './Account.css';


const Account = ({ usuario, totpToken, onActualizarUsuario  }) => {
  const { name, username, balance } = usuario;
  const navigate = useNavigate();
  const [mostrarActualizar, setMostrarActualizar] = useState(false);
  const [mostrarTransferencia, setMostrarTransferencia] = useState(false);

const handleLogout = () => {
  localStorage.removeItem('usuario');
  localStorage.removeItem('totpToken');
  navigate('/');
};


  const abrirTransferencia = () => {
    setMostrarTransferencia(true);
  };

  const cerrarTransferencia = () => {
    setMostrarTransferencia(false);
  };
  const manejarDatosActualizados = (nuevoUsuario, nuevoToken) => {
    onActualizarUsuario(nuevoUsuario, nuevoToken);
    setMostrarActualizar(false); 
  };

  return (
    <div className="screen-container">
      <div className="icon-container">
        <p className="saludo">Hola, {name}!</p>
        <LogoutOutlined className="logout-icon" onClick={handleLogout} />
      </div>

      <div className="user-container">
        <p className="saludo">Saldo actual</p>
        <h1 className="saldo">R$ {balance.toLocaleString()}</h1>
        <p className="saludo">alias: {username}</p>
      </div>

      <div className="buttonLogin-container">
        <Button type="primary" className="auth-button" onClick={abrirTransferencia}>
          Transferir
        </Button>
        <Button type="primary" className="auth-button" onClick={() => setMostrarActualizar(true)}>
          Actualizar información
        </Button>

      </div>

      {/* Historial visible directamente */}
      <HistorialTransacciones username={username} totpToken={totpToken} />

      {mostrarTransferencia && (
        <div className="modal-backdrop">
          <Transferencia fromUsername={username} totpToken={totpToken} onClose={cerrarTransferencia} />
        </div>
      )}
      {mostrarActualizar && (
        <div className="modal-backdrop">
          <ActualizarCuenta
            username={username}
            onDatosActualizados={manejarDatosActualizados}
            onClose={() => setMostrarActualizar(false)}
          />
        </div>
      )}

    </div>
  );
};

export default Account;
