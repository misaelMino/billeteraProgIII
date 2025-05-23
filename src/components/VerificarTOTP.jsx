import React, { useState } from 'react';
import axios from 'axios';
import './VerificarTOTP.css';

const VerificarTOTP = ({
  username,
  fromUsername,
  toUsername,
  amount,
  description,
  onTransferSuccess,
  onClose
}) => {
  const [token, setToken] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerificar = async () => {
    setLoading(true);
    try {
      // Paso 1: Verificar TOTP
      const response = await axios.post('https://raulocoin.onrender.com/api/verify-totp', {
        username,
        totpToken: token
      });

      if (response.data.success) {
        setMensaje('✅ TOTP verificado');

        // Paso 2: Transferencia
        const resTransfer = await axios.post('https://raulocoin.onrender.com/api/transfer', {
          fromUsername,
          toUsername,
          amount,
          description,
          operationToken: response.data.operationToken
        });

        if (resTransfer.data.success) {
          onTransferSuccess(resTransfer.data.transfer); // Mostrar comprobante
        } else {
          setMensaje('❌ ' + resTransfer.data.message);
        }
      } else {
        setMensaje('❌ ' + response.data.message);
      }
    } catch (error) {
      setMensaje('❌ Error en la verificación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-verificartotp">
      <h2>Verificar TOTP</h2>
      <input
        type="text"
        placeholder="Código TOTP"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <div className="buttons-container">
        <button onClick={handleVerificar} disabled={loading}>
          {loading ? 'Procesando...' : 'Enviar'}
        </button>
        <p>{mensaje}</p>
        <button onClick={onClose}>Cancelar</button>
        </div>

    </div>
  );
};

export default VerificarTOTP;
