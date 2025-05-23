import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerificarTOTP from './VerificarTOTP';
import Comprobante from './Comprobante';
import './Transferencia.css';

const Transferencia = ({ fromUsername, onClose }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [comprobanteData, setComprobanteData] = useState(null);

  const [toUsername, setToUsername] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  const handleTransferenciaExitosa = (dataTransferencia) => {
    setComprobanteData(dataTransferencia);
    setMostrarModal(false);
  };

  const abrirVerificacion = () => {
    setMostrarModal(true);
  };


  return (
    <div className="transferencia-modal">
      <h2>Realizar Transferencia</h2>

      <label>Alias destino</label>
      <input
        type="text"
        value={toUsername}
        onChange={(e) => setToUsername(e.target.value)}
      />

      <label>Monto</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <label>Descripción</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={abrirVerificacion}>Transferir</button>
      <button onClick={onClose}>Cancelar</button>

      {mostrarModal && (
        <div className="modal-backdrop">
          <VerificarTOTP
            username={fromUsername}
            fromUsername={fromUsername}
            toUsername={toUsername}
            amount={amount}
            description={description}
            onTransferSuccess={handleTransferenciaExitosa}
            onClose={() => setMostrarModal(false)}
          />
        </div>
      )}

      {comprobanteData && (
        <div className="modal-backdrop">
          <Comprobante datos={comprobanteData} onClose={() => {
            setComprobanteData(null);  // Limpia el comprobante
            onClose();                 // Esto cierra el modal de transferencia
            navigate('/account');     // Redirige a /account
          }} />
        </div>
      )}
    </div>
  );
};

export default Transferencia;
