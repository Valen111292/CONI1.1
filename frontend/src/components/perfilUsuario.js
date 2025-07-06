import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/ESLOGAN CONI.png';
import './estilos.css';
import actaGif from '../img/acta.gif';
import comprasGif from '../img/compras.gif';
import empleadosGif from '../img/empleados.gif';
import computadoraGif from '../img/computadora.gif';
import genearInformeGif from '../img/generar informe.gif';


const PerfilUsuario = () => {
  const navigate = useNavigate();

    useEffect(() => {
      const usuario = localStorage.getItem("usuarioLogueado");
      const rol = localStorage.getItem("rol");

      if (!usuario || rol !== "usuario") {
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
        sessionStorage.clear(); // Limpia sessionStorage si es necesario

        // Guarda un mensaje de cierre de sesión exitoso
        localStorage.setItem("logoutMessage", "Sesión cerrada exitosamente");
        window.location.href = "/";
      } else {
        console.error("Error al cerrar sesión, status:", response.status);
        alert("Error al cerrar sesión. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión", error);
      alert("Error de red al cerrar sesión. Por favor, verifica tu conexión.");
    }
  };

  return(
    <div>
    <section className="encabezado">
        <img src={logo} alt="Eslogan de CONI - Gestión de inventario" className="imagen-encabezado"/>
        <div className="barra-superior">
            <nav>
                <ul>
                    <li><button className='cerrarSesion' onClick={handleLogout}>Cerrar sesión</button></li>
                </ul>
            </nav>
        </div>
    </section>

    <main>
        <h2 className="titulo perfil-usuario">¿Que deseas gestionar hoy?</h2>
        <div className="contenido">
            <div className="gestion-equi-perif">
                <a href="/equipo"><img src={computadoraGif} alt="gestionar_equipos"/></a>
                <div className="container text-equipos">
                    <button><a href="/equipo">Equipos/Perifericos</a></button>
                </div>
            </div>
            <div className="gestion-compras">
                <a href="/ComprasForm"><img src={comprasGif} alt="compras"/></a>
                <div className="container text-compras">
                    <button><a href="/ComprasForm">Compras</a></button>
                </div>
            </div>
            <div className="gestion-actas">
                <a href="/ActaForm"><img src={actaGif} alt="acta"/></a>
                <div className="container text-actas">
                    <button><a href="/ActaForm">Actas</a></button>
                </div>
            </div>
            <div className="gestion-empleados">
                <a href="/EmpleadoForm"><img src={empleadosGif} alt="gestion_empleados"/></a>
                <div className="container text-empleados">
                    <button><a href="/EmpleadoForm">Empleados</a></button>
                </div>
            </div>
            <div className="informe">
                <a href="/InformeModulo"><img src={genearInformeGif} alt="generar_informe"/></a>
                <div className="container text-informe">
                    <button><a href="/InformeModulo">Generar informe</a></button>
                </div>
            </div>
        </div>
    </main>

</div>
  );
};

export default PerfilUsuario;