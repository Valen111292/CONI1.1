import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../img/ESLOGAN CONI.png' // Asegúrate de tener el logo en src como 'logo.png'
import logoAldir from '../img/logo aldir.png'; // Asegúrate de tener el logo Aldir en src como 'logoAldir.png'

function ActaForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const [equipos, setEquipos] = useState([]);
    const [formulario, setFormulario] = useState({ nombre_completo: '', cedula: '' });
    const [seleccionados, setSeleccionados] = useState([]);
    const [actasConsultadas, setActasConsultadas] = useState([]);
    const [consulta, setConsulta] = useState('');
    const { cedula, nombre } = location.state || {}; // Desestructura los datos pasados, o un objeto vacío si no hay state
    const [actaDAta, setActaDAta] = useState({
        nombre_completo: nombre || '',
        cedula: cedula || '',
    });

    useEffect(() => {
        setActaDAta(prev => ({
            ...prev,
            nombre_completo: nombre ||'',
            cedula: cedula || ''
        }));
    }, [cedula, nombre]); // Actualiza los datos de asignación si cambian

    useEffect(() => {
        const usuario = localStorage.getItem("usuarioLogueado");
        if (!usuario) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        fetch('http://localhost:8080/CONI1.0/EquipoServlet?accion=listar&estado=disponible')
            .then(res => res.json())
            .then(data => setEquipos(data))
            .catch(err => console.error(err));
    }, []);

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
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
        setActaDAta({ ...actaDAta, [e.target.name]: e.target.value});
    };

    const handleCheckboxChange = (n_inventario) => {
        setSeleccionados((prev) =>
            prev.includes(n_inventario)
                ? prev.filter((id) => id !== n_inventario)
                : [...prev, n_inventario]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Datos de acta a enviar:", actaDAta);
        alert("Lógica para registrar acta de equipo(simulado)");

        if (seleccionados.length === 0) {
            alert('Por favor seleccione al menos un equipo.');
            return;
        }

        const datos = {
            ...formulario,
            n_inventario: seleccionados
        };

        fetch('http://localhost:8080/CONI1.0/ActasServlet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
            .then(res => res.json())
            .then(data => {
                alert(data.mensaje);
                generarPDF(datos);
            })
            .catch(err => console.error(err));
    };

    const generarPDF = (datos) => {
        const doc = new jsPDF();

        const fecha = new Date().toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // Logo
        const img = new Image();
        img.src = logoAldir;
        doc.addImage(img, 'PNG', 10, 10, 50, 20);

        // Información del acta
        doc.setFontSize(12);
        doc.text(`Ciudad y fecha: Bogotá, ${fecha}`, 10, 40);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Asunto: Acta entrega de equipos y/o periféricos', 10, 50);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');

        const texto = `Distriquímicos Aldir hace entrega a ${datos.nombre_completo}, identificado con C.C. ${datos.cedula}, del siguiente material para uso en la empresa como se relaciona:`;
        doc.text(texto, 10, 60, { maxWidth: 190 });

        // Tabla con los equipos seleccionados
        const bodyEquipos = datos.n_inventario.map(id => {
            const eq = equipos.find(e => e.n_inventario === id);
            return [
                `${eq.clase} ${eq.marca}`,
                eq.n_inventario,
                eq.n_serie || 'N/A'
            ];
        });

        autoTable(doc, {
            startY: 80,
            head: [['Equipo', 'N° Inventario', 'N° de Serie']],
            body: bodyEquipos
        });

        const yFinal = doc.lastAutoTable.finalY + 30;

        // Firmas
        doc.text('Firma quien recibe', 20, yFinal);
        doc.text('Firma quien entrega', 130, yFinal);

        doc.save(`Acta_${datos.cedula}.pdf`);
    };

    console.log("Datos que se envían:", JSON.stringify(formulario));

    const consultarActas = () => {
        fetch(`http://localhost:8080/CONI1.0/ActasServlet?cedula=${consulta}`)
            .then(res => res.json())
            .then(data => setActasConsultadas(data))
            .catch(err => console.error(err));
    };

    const descargarPDF = (cedula) => {
        fetch(`http://localhost:8080/CONI1.0/DescargarPDFServlet?cedula=${cedula}`)
            .then(response => {
                if (!response.ok) throw new Error("No se pudo descargar el PDF");
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Acta_${cedula}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(error => {
                console.error("Error al descargar PDF:", error);
                alert("No se pudo descargar el PDF.");
            });
    };


    return (
        <div style={{ padding: '2rem' }}>

            <div className="encabezado">
                <img src={logo} className="imagen-encabezado" alt="Logo CONI" />
                <div className="barra-superior">
                    <nav>
                        <ul>
                            <li><button onClick={() => navigate("/perfilUsuario")}>Volver perfil usuario</button></li>
                            <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                        </ul>
                    </nav>
                </div>
            </div>


            <h2>Registrar Acta</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre_completo"
                    value={actaDAta.nombre_completo}
                    placeholder="Nombre completo"
                    onChange={handleChange}
                    required
                /><br />
                <input
                    type="text"
                    name="cedula"
                    placeholder="Cédula"
                    value={actaDAta.cedula}
                    onChange={handleChange}
                    required
                /><br />

                <h4>Seleccione uno o más equipos disponibles:</h4>
                {equipos.map((eq, i) => (
                    <div key={i}>
                        <label>
                            <input
                                type="checkbox"
                                value={eq.n_inventario}
                                onChange={() => handleCheckboxChange(eq.n_inventario)}
                                checked={seleccionados.includes(eq.n_inventario)}
                            />
                            {`${eq.clase} - ${eq.marca} - ${eq.n_inventario}`}
                        </label>
                    </div>
                ))}
                <br />
                <button type="submit">Registrar y Generar PDF</button>
            </form>

            <hr />
            <h2>Consultar Actas</h2>
            <input
                type="text"
                placeholder="N° Cédula"
                onChange={(e) => setConsulta(e.target.value)}
            />
            <button onClick={consultarActas}>Consultar</button>

            <ul>
                {actasConsultadas.map((acta, index) => (
                    <li key={index}>
                        Acta #{acta.id_acta}: {acta.nombre_completo} - {acta.cedula} - {acta.n_inventario} ({acta.fecha})
                        <button
                            onClick={() => descargarPDF(acta.cedula)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Descargar PDF
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ActaForm;
