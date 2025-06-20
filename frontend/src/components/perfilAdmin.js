// src/components/PerfilAdmin.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/ESLOGAN CONI.png';
import empleadosGif from '../img/empleados.gif';
import gestionarUsuarioGif from '../img/gestionar usuario.gif';
import generarInformeGif from '../img/generar informe.gif';
import './estilos.css'; // Asegúrate que el CSS esté aquí

const PerfilAdmin = ({ usuarioLogueado, rol }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = localStorage.getItem("usuarioLogueado");
    if (!usuario) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/CONI1.0/LogoutServlet", {
        method: "GET",
        credentials: "include"
      });

      if (response.ok) {
        localStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("rol");
        sessionStorage.clear();
        localStorage.setItem("logoutMessage", "Sesión cerrada exitosamente");
        navigate("/");
      } else {
        console.error("Error al cerrar sesión, status:", response.status);
      }
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div>
      <header className="encabezado">
        <img src={logo} alt="Eslogan de CONI - Gestión de inventario" className="imagen-encabezado" />
        <div className="barra-superior">
          <nav>
            <ul>
              <li><a href="/cambiar-password">Cambiar contraseña</a></li>
              <li><button onClick={handleLogout}>Cerrar sesión</button></li>
            </ul>
          </nav>
        </div>
      </header>

      <h2 className="titulo perfil-administrador">¿Qué deseas gestionar hoy?</h2>

      <main className="contenido">
        <div className="container gestion-administrador">

          <div className="gestion-usuario">
            <a href="/gestionUsuario">
              <img src={gestionarUsuarioGif} alt="Gestionar Usuario" />
            </a>
            <div className="container text-usuarios">
              <button><a href="/gestionUsuario">Usuarios</a></button>
              <p>Administra y controla los perfiles de acceso al sistema</p>
            </div>
          </div>

          <div className="informe">
            <a href="/generar-informe">
              <img src={generarInformeGif} alt="Generar Informe" />
            </a>
            <div className="container text-informe">
              <button><a href="/generar-informe">Generar informe</a></button>
              <p>Obtener informes detallados sobre el estado del inventario</p>
            </div>
          </div>

          <div className="gestion-empleados">
            <a href="/EmpleadoForm"><img src={empleadosGif} alt="gestion_empleados" /></a>
            <div className="container text-empleados">
              <button><a href="/EmpleadoForm">Empleados</a></button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PerfilAdmin;
