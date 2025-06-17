import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './estilos.css';
import logo from '../img/ESLOGAN CONI.png';

const EmpleadoForm = () => {
    const navigate = useNavigate();
    const [empleado, setEmpleado] = useState({
        nombre: "",
        cedula: "",
        email: "",
        cargo: "",
    });

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

    const handleChange = (e) => {
        setEmpleado({
            ...empleado, [e.target.name]: e.target.value
        });
    };

    const handleRegitrar = async (e) => {
        try {
            const response = await fetch("http://localhost:8080/CONI1.0/EmpleadoServlet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(empleado),
                credentials: "include"
            });
            const data = await response.text();
            alert(data);
        } catch (error) {
            alert("Error al registrar el empleado: " + error.message);
        }
    };

    const handleSolicitarEquipo = async () => {
        try {
            const response = await fetch("http://localhost:8080/CONI1.0/EmpleadoServlet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...empleado, accion: "solicitar_equipo" }),
                credentials: "include"
            });
            const data = await response.text();
            alert(data);
        } catch (error) {
            alert("Error al solicitar el equipo: ");
        }
    };

    return (
        <div>
            <div className="encabezado">
                <img src={logo} className="imagen-encabezado" alt="Logo CONI" />
                <div className="barra-superior">
                    <nav>
                        <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                    </nav>
                </div>
            </div>

            <div className="formulario-empleado">
                <h2>Registro de Empleado</h2>

                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={empleado.nombre}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="cedula"
                    placeholder="Cédula"
                    value={empleado.cedula}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={empleado.email}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="cargo"
                    placeholder="Cargo"
                    value={empleado.cargo}
                    onChange={handleChange}
                />

                <button onClick={handleRegitrar}>
                    Registrar Empleado
                </button>

                <button onClick={handleSolicitarEquipo}>
                    Solicitar Equipo
                </button>

            </div>
        </div>
    );
};
export default EmpleadoForm;