import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoComplete, Button } from 'antd';
import axios from 'axios';
import VerificarTOTP from './VerificarTOTP';
import Comprobante from './Comprobante';
import './Transferencia.css';

const Transferencia = ({ fromUsername, onClose }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [comprobanteData, setComprobanteData] = useState(null);
  const [toUsername, setToUsername] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [opciones, setOpciones] = useState([]);
  const navigate = useNavigate();

  const handleTransferenciaExitosa = (dataTransferencia) => {
    setComprobanteData(dataTransferencia);
    setMostrarModal(false);
  };

  const abrirVerificacion = () => {
    setMostrarModal(true);
  };

  const handleSearch = async (value) => {
    if (!value) {
      setOpciones([]);
      return;
    }
    try {
      const response = await axios.get(`https://raulocoin.onrender.com/api/search-users?q=${value}`);
      if (response.data.success && response.data.users.length > 0) {
        const results = response.data.users.map((user) => ({
          value: user.username, // lo que se guarda en toUsername
          label: `${user.name} (${user.username})`, // lo que se muestra
        }));
        setOpciones(results);
      } else {
        setOpciones([]);
      }
    } catch (error) {
      setOpciones([]);
    }
  };

  return (
    <div className="transferencia-modal">
      <h2>Realizar Transferencia</h2>

      <label>Alias destino</label>
      <AutoComplete
        style={{ width: '100%' }}
        options={opciones}
        value={toUsername}
        onSearch={handleSearch}
        onSelect={(value) => setToUsername(value)}
        onChange={(value) => setToUsername(value)}
        placeholder="Escribí un alias..."
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

      <Button type="primary" onClick={abrirVerificacion}>
        Transferir
      </Button>
      <Button onClick={onClose}>Cancelar</Button>

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
          <Comprobante
            datos={comprobanteData}
            onClose={() => {
              setComprobanteData(null);
              onClose();
              navigate('/account');
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Transferencia;
