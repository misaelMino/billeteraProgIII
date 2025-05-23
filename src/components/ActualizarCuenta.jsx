// src/components/ActualizarCuenta.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ActualizarCuenta.css'; // Podés usar el mismo estilo

const ActualizarCuenta = ({ username, onDatosActualizados, onClose }) => {
  const [token, setToken] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerificarYActualizar = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://raulocoin.onrender.com/api/verify-totp', {
        username,
        totpToken: token
      });

      if (response.data.success) {
        setMensaje('✅ TOTP verificado');

        // Buscar los nuevos datos de cuenta
        const resUsuario = await axios.post('https://raulocoin.onrender.com/api/user-details', {
          username,
          totpToken: token
        });

        if (resUsuario.data.success) {
          onDatosActualizados(resUsuario.data.user, token); // Actualiza datos en Account.jsx
        } else {
          setMensaje('❌ ' + resUsuario.data.message);
        }
      } else {
        setMensaje('❌ ' + response.data.message);
      }
    } catch (error) {
      setMensaje('❌ Error al actualizar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-verificartotp">
      <h2>Actualizar cuenta</h2>
      <input
        type="text"
        placeholder="Código TOTP"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <div className="buttons-container">
        <button onClick={handleVerificarYActualizar} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
        <p>{mensaje}</p>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ActualizarCuenta;
