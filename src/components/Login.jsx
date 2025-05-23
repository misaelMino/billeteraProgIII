import React, { useState } from 'react';
import { Button, Input } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [alias, setAlias] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      username: alias,
      totpToken: codigo,
    };

    try {
      const response = await axios.post('https://raulocoin.onrender.com/api/user-details', data);
      const res = response.data;

      if (res.success && res.user) {
        // Actualiza el usuario logueado en App.jsx
        onLoginSuccess(
          {
            name: res.user.name,
            username: res.user.username,
            balance: res.user.balance,
          },
          codigo // <-- este es el token TOTP
        );

        // Redirige a /account
        navigate('/account', {
          state: {
            name: res.user.name,
            username: res.user.username,
            balance: res.user.balance,
          },
        });
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 403 &&
        error.response.data.message ===
        'Debes completar la verificación TOTP para acceder a los detalles del usuario'
      ) {
        navigate('/verify-account', {
          state: { alias },
        });
      } else {
        alert('Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src="/assets/raulCoin.png" alt="raulCoin" className="logo-img" />
      <h1 className="auth-title">Iniciar sesión</h1>
      <p className="auth-subtitle">Hola! Te damos la bienvenida nuevamente (:</p>
      <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <Input
            type="text"
            placeholder="Alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            required
            className="login-input"
          />
          <Input
            type="text"
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            className="login-input"
          />
        <Button type="primary" htmlType="submit" className="auth-button" disabled={loading}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </Button>

        <p className="auth-p-end">
          <Link className="auth-link" to="/register">
            Crear nueva cuenta
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
