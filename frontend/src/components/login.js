import React, { useState } from 'react';
import logo from '../img/ESLOGAN CONI.png';
import './estilos.css'; // copia tu CSS de sesion.css aquí

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rol: ''
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/CONI1.0/LoginServlet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials:'include',
        body: new URLSearchParams(formData)
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("usuarioLogueado", formData.username);
        localStorage.setItem("rol", data.rol);

        if (data.rol === "admin") {
          window.location.href = "/perfilAdmin";
        } else {
          window.location.href = "/perfilUsuario";
        }
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div>
      <header className="encabezado">
        <img src={logo} alt="Eslogan de CONI" className="imagen-encabezado" />
        <div className="barra-superior">
          <nav>
            <ul>
              <li><a href="/">Atrás</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className='login'>
        <div className="container textos-sesion">
          <h1>¡Inicia sesión!</h1>
        </div>
        <form className="inicio-sesion" onSubmit={handleSubmit} required>
          <h4>¿Cómo deseas iniciar sesión?</h4>
          <select name="rol" required onChange={handleChange}>
            <option value="">-- Selecciona un rol --</option>
            <option value="admin">Administrador</option>
            <option value="usuario">Usuario</option>
          </select>

          <h4>Usuario</h4>
          <input type="text" name="username" placeholder="Nombre de usuario" required onChange={handleChange} />

          <h4>Contraseña</h4>
          <input type="password" name="password" placeholder="Contraseña" required autoComplete="current-password" onChange={handleChange} />

          <h5><a href="/recuperar">¿olvidaste tu contraseña?</a></h5>

          <button type="submit">Iniciar sesión</button>
        </form>
      </main>
    </div>
  );
}

export default Login;
