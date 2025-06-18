import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import logo from './img/logoaldir.png'; // Asegúrate de tener el logo en src como 'logo.png'

function ActaForm() {
    const navigate = useNavigate();
    const [equipos, setEquipos] = useState([]);
    const [formulario, setFormulario] = useState({ nombre_completo: '', cedula: '' });
    const [seleccionados, setSeleccionados] = useState([]);
    const [actasConsultadas, setActasConsultadas] = useState([]);
    const [consulta, setConsulta] = useState('');
 

    useEffect(() => {
        fetch('http://localhost:8080/coni1.2/api/equipos?estado=disponible')
            .then(res => res.json())
            .then(data => setEquipos(data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
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

        if (seleccionados.length === 0) {
            alert('Por favor seleccione al menos un equipo.');
            return;
        }

        const datos = {
            ...formulario,
            n_inventario: seleccionados
        };

        fetch('http://localhost:8080/coni1.2/ActasServlet', {
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
        img.src = logo;
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
        fetch(`http://localhost:8080/coni1.2/ActasServlet?cedula=${consulta}`)
            .then(res => res.json())
            .then(data => setActasConsultadas(data))
            .catch(err => console.error(err));
    };

    const descargarPDF = (cedula) => {
        fetch(`http://localhost:8080/coni1.2/DescargarPDFServlet?cedula=${cedula}`)
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
            <button onClick={() => navigate("/")}>Volver a Gestión de Equipos</button>
            <h2>Registrar Acta</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre_completo"
                    placeholder="Nombre completo"
                    onChange={handleChange}
                    required
                /><br />
                <input
                    type="text"
                    name="cedula"
                    placeholder="Cédula"
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
