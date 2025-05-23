import React from 'react';
import './Comprobante.css';

const Comprobante = ({ datos, onClose }) => {
  const { from, to, amount, description, timestamp } = datos;

  const fecha = new Date(timestamp * 1000).toLocaleString();

  return (
    <div className="modal">
      <h2>✅ Transferencia exitosa</h2>
      <p><strong>De:</strong> {from.username}</p>
      <p><strong>Para:</strong> {to.username}</p>
      <p><strong>Monto:</strong> {amount}</p>
      <p><strong>Descripción:</strong> {description}</p>
      <p><strong>Fecha y hora:</strong> {fecha}</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default Comprobante;
