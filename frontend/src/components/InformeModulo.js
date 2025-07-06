import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Importar la librería XLSX
import logo from '../img/ESLOGAN CONI.png';
import '../App.css'; // Asegúrate de que tus estilos CSS estén aquí

const InformeModulo = () => {
    const navigate = useNavigate();

    // --- ESTADOS PARA LA INFORMACIÓN DEL USUARIO ---
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserRol, setCurrentUserRol] = useState(null);
    const [currentUserCargo, setCurrentUserCargo] = useState(null);
    const [cargandoUsuario, setCargandoUsuario] = useState(true);

    // --- ESTADOS PARA EL INFORME ACTUAL ---
    const [reportData, setReportData] = useState([]);
    const [cargandoReporte, setCargandoReporte] = useState(false);
    const [errorReporte, setErrorReporte] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // Filtro de estado para el informe actual

    // --- ESTADOS PARA INFORMES HISTÓRICOS ---
    const [historicalReports, setHistoricalReports] = useState([]);
    const [cargandoHistorico, setCargandoHistorico] = useState(false);
    const [errorHistorico, setErrorHistorico] = useState('');
    const [selectedHistoricalReportData, setSelectedHistoricalReportData] = useState(null); // Para ver un informe histórico completo
    const [isHistoricalModalOpen, setIsHistoricalModalOpen] = useState(false);

    // Opciones de estado de asignación para el filtro (basadas en equipos_perifericos.estado)
    const assignmentStatusOptions = [
        { value: 'all', label: 'Todos los Estados' },
        { value: 'ASIGNADO', label: 'Asignado' },
        { value: 'DISPONIBLE', label: 'Disponible' },
        { value: 'PENDIENTE', label: 'Pendiente' },
        // Puedes añadir más estados si los tienes en tu DB para equipos_perifericos.estado
    ];

    // --- Obtener información del usuario desde localStorage ---
    useEffect(() => {
        const id = localStorage.getItem("idUsuario");
        const rol = localStorage.getItem("rol");
        const cargo = localStorage.getItem("cargoEmpleado");

        if (id && rol && cargo) {
            setCurrentUserId(parseInt(id, 10));
            setCurrentUserRol(rol);
            setCurrentUserCargo(cargo);
        } else {
            console.warn("No se encontró información de usuario en localStorage. Redirigiendo a login.");
            navigate("/");
        }
        setCargandoUsuario(false);
    }, [navigate]);

    // --- FUNCIÓN PARA OBTENER EL INFORME DE INVENTARIO ACTUAL ---
    const fetchCurrentReport = useCallback(async () => {
        if (!currentUserId) return;

        setCargandoReporte(true);
        setErrorReporte('');

        try {
            const queryParams = new URLSearchParams();
            if (filterStatus !== 'all') {
                queryParams.append('filterStatus', filterStatus);
            }

            const url = `http://localhost:8080/CONI1.0/api/informes/inventario?${queryParams.toString()}`;
            const response = await fetch(url, { credentials: 'include' });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, Mensaje: ${errorData.mensaje || 'Error desconocido'}`);
            }

            const data = await response.json();
            setReportData(data);
        } catch (err) {
            console.error('Error al obtener el informe actual:', err);
            setErrorReporte(`No se pudo cargar el informe: ${err.message}.`);
        } finally {
            setCargandoReporte(false);
        }
    }, [currentUserId, filterStatus]);

    // --- FUNCIÓN PARA OBTENER LA LISTA DE INFORMES HISTÓRICOS ---
    const fetchHistoricalReports = useCallback(async () => {
        if (!currentUserId) return;

        setCargandoHistorico(true);
        setErrorHistorico('');

        try {
            const url = `http://localhost:8080/CONI1.0/api/informes/historico`;
            const response = await fetch(url, { credentials: 'include' });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, Mensaje: ${errorData.mensaje || 'Error desconocido'}`);
            }

            const data = await response.json();
            setHistoricalReports(data);
        } catch (err) {
            console.error('Error al obtener informes históricos:', err);
            setErrorHistorico(`No se pudieron cargar los informes históricos: ${err.message}.`);
        } finally {
            setCargandoHistorico(false);
        }
    }, [currentUserId]);

    // --- EFECTO PARA CARGAR EL INFORME ACTUAL Y LOS HISTÓRICOS AL MONTAR/CAMBIAR FILTRO ---
    useEffect(() => {
        if (currentUserId) {
            fetchCurrentReport();
            fetchHistoricalReports();
        }
    }, [currentUserId, fetchCurrentReport, fetchHistoricalReports]);

    // --- FUNCIÓN PARA GUARDAR Y DESCARGAR EL INFORME ACTUAL ---
    const handleGenerateAndDownload = async () => {
        if (reportData.length === 0) {
            alert("No hay datos para generar el informe.");
            return;
        }

        // 1. Guardar el informe en la base de datos
        try {
            const reportToSave = {
                estadoFiltro: filterStatus,
                reporteJson: JSON.stringify(reportData) // Convertir el array de objetos a una cadena JSON
            };

            const response = await fetch('http://localhost:8080/CONI1.0/api/informes/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportToSave),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.mensaje);
                fetchHistoricalReports(); // Recargar la lista de informes históricos
            } else {
                alert(`Error al guardar informe: ${data.mensaje || 'Ocurrió un error desconocido.'}`);
            }
        } catch (error) {
            console.error('Error al guardar el informe:', error);
            alert('Error de conexión con el servidor al guardar el informe.');
        }

        // 2. Descargar el informe como Excel
        exportToExcel(reportData, `Informe_Inventario_${filterStatus}_${new Date().toISOString().slice(0, 10)}`);
    };

    // --- FUNCIÓN PARA DESCARGAR UN INFORME HISTÓRICO ESPECÍFICO ---
    const handleDownloadHistorical = async (reportId, filename) => {
        if (!currentUserId) {
            alert("Usuario no autenticado.");
            return;
        }
        try {
            const url = `http://localhost:8080/CONI1.0/api/informes/historico?id=${reportId}`;
            const response = await fetch(url, { credentials: 'include' });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, Mensaje: ${errorData.mensaje || 'Error desconocido'}`);
            }

            const data = await response.json(); // Esto ya debería ser el JSON del reporte
            exportToExcel(data, filename);
        } catch (err) {
            console.error('Error al descargar informe histórico:', err);
            alert(`No se pudo descargar el informe histórico: ${err.message}.`);
        }
    };

    // --- FUNCIÓN PARA EXPORTAR DATOS A EXCEL ---
    const exportToExcel = (data, filename) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Informe");
        XLSX.writeFile(wb, `${filename}.xlsx`);
    };

    // --- FUNCIÓN PARA VER DETALLES DE UN INFORME HISTÓRICO EN UN MODAL ---
    const handleViewHistorical = async (reportId) => {
        if (!currentUserId) {
            alert("Usuario no autenticado.");
            return;
        }
        try {
            const url = `http://localhost:8080/CONI1.0/api/informes/historico?id=${reportId}`;
            const response = await fetch(url, { credentials: 'include' });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, Mensaje: ${errorData.mensaje || 'Error desconocido'}`);
            }

            const data = await response.json(); // Esto ya debería ser el JSON del reporte
            setSelectedHistoricalReportData(data);
            setIsHistoricalModalOpen(true);
        } catch (err) {
            console.error('Error al ver informe histórico:', err);
            alert(`No se pudo cargar el informe histórico para ver: ${err.message}.`);
        }
    };

    const handleCloseHistoricalModal = () => {
        setIsHistoricalModalOpen(false);
        setSelectedHistoricalReportData(null);
    };

    // --- FUNCIÓN PARA CERRAR SESIÓN ---
    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/CONI1.0/LogoutServlet", {
                method: "GET",
                credentials: "include"
            });

            if (response.ok) {
                localStorage.removeItem("usuarioLogueado");
                localStorage.removeItem("rol");
                localStorage.removeItem("idUsuario");
                localStorage.removeItem("cargoEmpleado");
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

    // Si el usuario aún está cargando o no está autenticado, muestra un mensaje
    if (cargandoUsuario) {
        return <p>Cargando información de usuario...</p>;
    }

    if (!currentUserId) {
        return <p>Por favor, inicie sesión para acceder al módulo de informes.</p>;
    }

    return (
        <div className="informe-modulo">
            <header className="encabezado">
                <img src={logo} className="imagen-encabezado" alt="Logo CONI" />
                <div className="barra-superior">
                    <nav>
                        <ul>
                            <li><button onClick={() => navigate("/perfilUsuario")}>Volver perfil usuario</button></li>
                            <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="container informe-main">
                <h1>Módulo de Informes de Inventario</h1>

                {/* Sección de Informe Actual */}
                <section className="reporte-actual">
                    <h2>Informe de Inventario Actual</h2>
                    <div className="control-group">
                        <label htmlFor="filterStatus">Filtrar por Estado de Asignación:</label>
                        <select
                            id="filterStatus"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            {assignmentStatusOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <button onClick={fetchCurrentReport}>Aplicar Filtro</button>
                    </div>

                    {cargandoReporte ? (
                        <p>Cargando informe actual...</p>
                    ) : errorReporte ? (
                        <p className="error-mensaje">{errorReporte}</p>
                    ) : reportData.length === 0 ? (
                        <p>No hay datos de inventario disponibles para el filtro seleccionado.</p>
                    ) : (
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID Inventario</th> {/* n_inventario */}
                                        <th>Categoría</th> {/* clase */}
                                        <th>Tipo</th> {/* tipo */}
                                        <th>Marca</th> {/* marca */}
                                        <th>Serial</th> {/* n_serie */}
                                        <th>RAM</th> {/* ram */}
                                        <th>Disco</th> {/* disco */}
                                        <th>Procesador</th> {/* procesador */}
                                        <th>Estado Asignación</th> {/* estado */}
                                        <th>Asignado A</th>
                                        <th>Fecha Asignación</th>
                                        {/* No hay fecha de devolución directa para el item en sí */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((item) => (
                                        <tr key={`${item.categoria}-${item.id}`}>
                                            <td>{item.id}</td>
                                            <td>{item.categoria}</td>
                                            <td>{item.tipo}</td>
                                            <td>{item.marca}</td>
                                            <td>{item.serial}</td>
                                            <td>{item.ram || 'N/A'}</td>
                                            <td>{item.disco || 'N/A'}</td>
                                            <td>{item.procesador || 'N/A'}</td>
                                            <td>{item.estadoAsignacion}</td>
                                            <td>{item.asignadoA}</td>
                                            <td>{item.fechaAsignacion ? new Date(item.fechaAsignacion).toLocaleString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="btn-generar-excel" onClick={handleGenerateAndDownload}>
                                Generar y Descargar Informe (Excel)
                            </button>
                        </>
                    )}
                </section>

                {/* Sección de Informes Históricos */}
                <section className="informes-historicos">
                    <h2>Informes Históricos</h2>
                    {cargandoHistorico ? (
                        <p>Cargando informes históricos...</p>
                    ) : errorHistorico ? (
                        <p className="error-mensaje">{errorHistorico}</p>
                    ) : historicalReports.length === 0 ? (
                        <p>No hay informes históricos guardados aún.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Informe</th>
                                    <th>Fecha Generación</th>
                                    <th>Generado Por</th>
                                    <th>Filtro Aplicado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicalReports.map((report) => (
                                    <tr key={report.id}>
                                        <td>{report.id}</td>
                                        <td>{new Date(report.fechaGeneracion).toLocaleString()}</td>
                                        <td>{report.nombreUsuarioGenerador}</td>
                                        <td>{report.estadoFiltro}</td>
                                        <td>
                                            <button
                                                className="btn-accion btn-ver"
                                                onClick={() => handleViewHistorical(report.id)}
                                            >
                                                Ver Informe
                                            </button>
                                            <button
                                                className="btn-accion btn-descargar"
                                                onClick={() => handleDownloadHistorical(report.id, `Informe_Historico_${report.id}`)}
                                            >
                                                Descargar Excel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>

            {/* Modal para ver informe histórico completo */}
            {isHistoricalModalOpen && selectedHistoricalReportData && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Detalle del Informe Histórico</h3>
                        <div className="report-detail-table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID Inventario</th>
                                        <th>Categoría</th>
                                        <th>Tipo</th>
                                        <th>Marca</th>
                                        <th>Serial</th>
                                        <th>RAM</th>
                                        <th>Disco</th>
                                        <th>Procesador</th>
                                        <th>Estado Asignación</th>
                                        <th>Asignado A</th>
                                        <th>Fecha Asignación</th>
                                        {/* No hay fecha de devolución directa para el item en sí en el histórico */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedHistoricalReportData.map((item) => (
                                        <tr key={`${item.categoria}-${item.id}`}>
                                            <td>{item.id}</td>
                                            <td>{item.categoria}</td>
                                            <td>{item.tipo}</td>
                                            <td>{item.marca}</td>
                                            <td>{item.serial}</td>
                                            <td>{item.ram || 'N/A'}</td>
                                            <td>{item.disco || 'N/A'}</td>
                                            <td>{item.procesador || 'N/A'}</td>
                                            <td>{item.estadoAsignacion}</td>
                                            <td>{item.asignadoA}</td>
                                            <td>{item.fechaAsignacion ? new Date(item.fechaAsignacion).toLocaleString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-cancelar" onClick={handleCloseHistoricalModal}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InformeModulo;
