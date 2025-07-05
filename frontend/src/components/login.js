import React, { useState, useEffect } from 'react';
import logo from '../img/ESLOGAN CONI.png';
import './estilos.css'; // copia tu CSS de sesion.css aquí

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rol: ''
  });

    useEffect(() => {
    const logoutMessage = localStorage.getItem("logoutMessage");
    if (logoutMessage) {
      // Puedes mostrar un mensaje al usuario si lo deseas, por ejemplo:
      // alert(logoutMessage);
      localStorage.removeItem("logoutMessage"); // Limpia el mensaje después de leerlo
    }
  }, []);

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
          'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // Ajuste aquí: el servlet devuelve 'success' y el rol está dentro de 'data.user.rolAutenticacion'
      if (data.success) {
        // Guardar datos en localStorage para persistencia
        localStorage.setItem("usuarioLogueado", data.user.username);
        localStorage.setItem("rol", data.user.rolAutenticacion); // Usar rolAutenticacion del servlet

        // Redirigir según el rol
        if (data.user.rolAutenticacion === "admin") {
          window.location.href = "/perfilAdmin";
        } else {
          window.location.href = "/perfilUsuario";
        }
      } else {
        // Mostrar mensaje de error del servlet
        alert(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.");
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