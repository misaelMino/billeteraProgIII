import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistorialTransacciones.css';

const HistorialTransacciones = ({ username, totpToken, onTokenExpirado }) => {
  const [transacciones, setTransacciones] = useState([]);
  const [expandida, setExpandida] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHistorial = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://raulocoin.onrender.com/api/transactions', {
        username,
        totpToken,
      });

      if (response.data.success) {
        setTransacciones(response.data.transactions);
      } else {
        if (response.data.message.includes('token expirado') || response.data.message.includes('invalid token')) {
          onTokenExpirado();
        } else {
          setError('No se pudo obtener el historial.');
        }
      }
    } catch (err) {
      // Si detectas un error que implica token expirado, lanza la función
      if (err.response?.data?.message?.includes('token expirado')) {
        onTokenExpirado();
      } else {
        setError('Error al cargar historial de transacciones.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, [username, totpToken]);

  const toggleExpandir = (id) => {
    setExpandida(expandida === id ? null : id);
  };

  const getColorClass = (tipo) => {
    switch (tipo) {
      case 'sent': return 'color-sent';
      case 'received': return 'color-received';
      case 'award': return 'color-awarded';
      default: return '';
    }
  };

  return (
    <div className="historial-container">
      <h2 className="historial-title">Historial de transacciones</h2>
      {loading && <p>Cargando...</p>}
      {error && (
        <div>
          <p className="error-text">{error}</p>
          <button onClick={fetchHistorial}>Reintentar</button>
        </div>
      )}
      {!loading && transacciones.length === 0 && !error && <p>No hay transacciones aún.</p>}
      {transacciones.map((tx) => (
        <div
          key={tx.id}
          className={`transaccion ${expandida === tx.id ? 'expandida' : ''}`}
          onClick={() => toggleExpandir(tx.id)}
        >
          <div className="transaccion-header">
            <div className="monto-descripcion">
              <span className="monto">
                R$ {tx.type === 'sent' ? '-' : ''}{Math.abs(tx.amount)}
              </span>

              <span className="descripcion">alias: {tx.type === 'sent' ? tx.toUsername : tx.fromUsername}</span>
            </div>
            <div className={`tipo-indicador ${getColorClass(tx.type)}`} />
          </div>

          {expandida === tx.id && (
            <div className="transaccion-detalle">
              <p><strong>De:</strong> {tx.fromName || 'Sistema'}</p>
              <p><strong>Para:</strong> {tx.toName}</p>
              <p><strong>Tipo:</strong> {tx.type}</p>
              <p><strong>Fecha:</strong> {new Date(tx.createdAt * 1000).toLocaleString()}</p>
              {tx.type === 'award' && <p><strong>Otorgado por:</strong> {tx.awardedBy}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


export default HistorialTransacciones;
