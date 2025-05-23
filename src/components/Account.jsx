import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import Transferencia from './Transferencia';
import HistorialTransacciones from './HistorialTransacciones';
import './Account.css';


const Account = ({ usuario, totpToken }) => {
  const { name, username, balance } = usuario;
  const navigate = useNavigate();

  const [mostrarTransferencia, setMostrarTransferencia] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const abrirTransferencia = () => {
    setMostrarTransferencia(true);
  };

  const cerrarTransferencia = () => {
    setMostrarTransferencia(false);
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

      <Button type="primary" className="auth-button" onClick={abrirTransferencia}>
        Transferir
      </Button>

      {/* Historial visible directamente */}
      <HistorialTransacciones username={username} totpToken={totpToken} />

      {mostrarTransferencia && (
        <div className="modal-backdrop">
          <Transferencia fromUsername={username} totpToken={totpToken} onClose={cerrarTransferencia} />
        </div>
      )}
    </div>
  );
};

export default Account;
