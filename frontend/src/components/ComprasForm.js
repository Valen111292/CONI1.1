import React, { useState, useEffect, useCallback } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import logo from '../img/ESLOGAN CONI.png'; // Asegúrate de que la ruta a tu logo sea correcta

const ComprasForm = () => {
    const navigate = useNavigate();

    // --- ESTADOS PARA EL FORMULARIO DE COMPRAS ---
    const [descripcion, setDescripcion] = useState('');
    const [altaPrioridad, setAltaPrioridad] = useState(false);
    const [mensajeFormulario, setMensajeFormulario] = useState(''); // Mensajes para el formulario

    const [claseSeleccionada, setClaseSeleccionada] = useState('');
    const [tipoEquipoSeleccionado, setTipoEquipoSeleccionado] = useState('');
    const [almacenamientoSeleccionado, setAlmacenamientoSeleccionado] = useState('');
    const [ramSeleccionada, setRamSeleccionada] = useState('');
    const [procesadorSeleccionado, setProcesadorSeleccionado] = useState('');

    const [tipoPerifericoSeleccionado, setTipoPerifericoSeleccionado] = useState('');
    const [perifericoEspecificoSeleccionado, setPerifericoEspecificoSeleccionado] = useState('');


    // --- ESTADOS PARA EL LISTADO DE SOLICITUDES ---
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargandoSolicitudes, setCargandoSolicitudes] = useState(true);
    const [errorListado, setErrorListado] = useState('');
    // ELIMINAMOS 'recargarListado' y 'setRecargarListado' por completo.

    // --- ESTADOS PARA ORDENAMIENTO Y FILTRADO ---
    const [sortBy, setSortBy] = useState('fecha'); // Por defecto, ordenar por fecha
    const [sortOrder, setSortOrder] = useState('desc'); // Por defecto, descendente
    const [filterPriority, setFilterPriority] = useState('all'); // Por defecto, no filtrar por prioridad
    const [searchKeyword, setSearchKeyword] = useState(''); // Estado para la palabra clave de búsqueda


    // --- DATOS DE OPCIONES PARA LOS SELECTS DINÁMICOS ---
    const opcionesAlmacenamiento = ["256GB SSD", "512GB SSD", "1TB SSD"];
    const opcionesRAM = ["4GB", "8GB", "16GB"];
    const opcionesProcesador = ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "M1", "M1 Pro", "M1 Max", "M1 Ultra"];

    const opcionesPerifericosSalida = ["Diademas", "Parlantes", "Monitor 19in a 24in"];
    const opcionesPerifericosEntrada = ["Mouse", "Teclado", "Webcam", "Micrófono", "Cargador", "Cable Corriente Alterna"];
    const opcionesPerifericosAlmacenamiento = ["Disco Duro Portátil", "USB",]


    // --- FUNCIÓN MEMORIZADA PARA CARGAR EL LISTADO DE SOLICITUDES ---
    // Esta función se re-creará solo cuando sus dependencias cambien.
    const fetchSolicitudes = useCallback(async () => {
        setCargandoSolicitudes(true);
        setErrorListado('');

        try {
            // Construir los parámetros de consulta
            const queryParams = new URLSearchParams();
            if (sortBy) {
                queryParams.append('sortBy', sortBy);
            }
            if (sortOrder) {
                queryParams.append('order', sortOrder);
            }
            if (filterPriority !== 'all') { // Solo añadir si no es 'all'
                queryParams.append('filterPriority', filterPriority);
            }
            if (searchKeyword.trim() !== '') {
                queryParams.append('search', searchKeyword.trim());
            }

            const url = `http://localhost:8080/CONI1.0/api/solicitudes?${queryParams.toString()}`;

            const response = await fetch(url, {
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json(); // Intenta leer el mensaje de error del backend
                throw new Error(`HTTP error! status: ${response.status}, Mensaje: ${errorData.mensaje || 'Ocurrió un error desconocido.'}`);
            }

            const data = await response.json();
            setSolicitudes(data);
        } catch (err) {
            console.error('Error al obtener las solicitudes:', err);
            setErrorListado(`No se pudieron cargar las solicitudes: ${err.message}.`);
        } finally {
            setCargandoSolicitudes(false);
        }
    }, [sortBy, sortOrder, filterPriority, searchKeyword, setCargandoSolicitudes, setErrorListado, setSolicitudes]); // Dependencias de useCallback

    // --- EFECTO PARA CARGAR LAS SOLICITUDES ---
    // Se ejecutará cuando 'fetchSolicitudes' cambie (es decir, cuando cambien los parámetros de búsqueda/filtro)
    // o cuando el componente se monte por primera vez.
    useEffect(() => {
        fetchSolicitudes();
    }, [fetchSolicitudes]); // Dependencia: la función fetchSolicitudes (que cambia cuando sus propias dependencias cambian)


    // --- Manejador de cambio para la CLASE principal ---
    const handleClaseChange = (e) => {
        const selectedClase = e.target.value;
        setClaseSeleccionada(selectedClase);
        // Resetear todos los estados de los sub-selects cuando cambia la clase principal
        setTipoEquipoSeleccionado('');
        setAlmacenamientoSeleccionado('');
        setRamSeleccionada('');
        setProcesadorSeleccionado('');
        setTipoPerifericoSeleccionado('');
        setPerifericoEspecificoSeleccionado('');
    };

    // --- FUNCIÓN PARA ENVIAR LA SOLICITUD (FORMULARIO) ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMensajeFormulario(''); // Limpiar mensajes anteriores

        if (claseSeleccionada === "") {
            setMensajeFormulario("Por favor, seleccione una Clase (Equipo, periférico, o ambos).");
            return;
        }
        if (descripcion.trim() === "") {
            setMensajeFormulario("Por favor agregue una descripción de la solicitud.");
            return;
        }

        // Construir la descripción de la solicitud con las características seleccionadas
        let finalDescription = descripcion;
        if (claseSeleccionada === "Equipo" || claseSeleccionada === "Equipo/Periferico") {
            if (tipoEquipoSeleccionado) finalDescription += `\nTipo de Equipo: ${tipoEquipoSeleccionado}`;
            if (almacenamientoSeleccionado) finalDescription += `\nAlmacenamiento: ${almacenamientoSeleccionado}`;
            if (ramSeleccionada) finalDescription += `\nRAM: ${ramSeleccionada}`;
            if (procesadorSeleccionado) finalDescription += `\nProcesador: ${procesadorSeleccionado}`;
        }
        if (claseSeleccionada === "Periferico" || claseSeleccionada === "Equipo/Periferico") {
            if (tipoPerifericoSeleccionado) finalDescription += `\nTipo Periférico: ${tipoPerifericoSeleccionado}`;
            if (perifericoEspecificoSeleccionado) finalDescription += `\nPeriférico Específico: ${perifericoEspecificoSeleccionado}`;
        }

        const datosSolicitud = {
            tipoSolicitud: claseSeleccionada, //Ahora enviamos la clase principal como tipoSolicitud
            descripcion: finalDescription, //La descripción combinada
            altaPrioridad,
        };

        try {
            const response = await fetch('http://localhost:8080/CONI1.0/api/solicitudes-compra', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosSolicitud),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setMensajeFormulario(data.mensaje);
                // Limpia el formulario después de un envío exitoso
                setClaseSeleccionada('');
                setTipoEquipoSeleccionado('');
                setAlmacenamientoSeleccionado('');
                setRamSeleccionada('');
                setProcesadorSeleccionado('');
                setTipoPerifericoSeleccionado('');
                setPerifericoEspecificoSeleccionado('');
                setDescripcion(''); //Limpiar descripción
                setAltaPrioridad(false);
                fetchSolicitudes(); // Llama directamente a fetchSolicitudes para recargar el listado
            } else {
                setMensajeFormulario(`Error al enviar la solicitud: ${data.mensaje || 'Ocurrió un error desconocido.'}`);
            }
        } catch (error) {
            console.error('Error al conectar con el backend (envío):', error);
            setMensajeFormulario('Error de conexión con el servidor. Inténtelo de nuevo.');
        }
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

    //Helper para determinar si las opciones de equipo deben estar visibles/habilitadas
    const showEquipoOptions = claseSeleccionada === "Equipo" || claseSeleccionada === "Equipo/Periferico";
    //Helper para determinar si las opciones de periférico deben estar visibles/habilitadas
    const showPerifericoOptions = claseSeleccionada === "Periferico" || claseSeleccionada === "Equipo/Periferico";


    return (
        <div className="compras-modulo">
            <main>
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

                <div className="container-textos">
                    <p>
                        Para realizar la solicitud, por favor complete todos los datos requeridos sobre el equipo o
                        periférico necesario.
                    </p>
                </div>

                <div className="container desplegable-compras">
                    <form id="formularioCompras" onSubmit={handleSubmit}>
                        {/*SELECT PRINCIPAL: CLASE*/}
                        <div className="seleccion">
                            <label htmlFor="claseSolicitud">Clase de Solicitud</label>
                        </div>
                        <select
                            name="clase"
                            id="claseSolicitud"
                            value={claseSeleccionada}
                            onChange={handleClaseChange}
                        >
                            <option value="">---Seleccione una clase---</option>
                            <option value="Equipo">Equipo</option>
                            <option value="Periferico">Periférico</option>
                            <option value="Equipo/Periferico">Equipo/Periferico</option>
                        </select>

                        {/*OPCIONES PARA CLASE "EQUIPO" O "EQUIPO/PERIFÉRICO"*/}
                        {(showEquipoOptions) && (
                            <>
                                <div className="seleccion">
                                    <label htmlFor="tipoEquipo">Tipo Equipo</label>
                                </div>
                                <select
                                    name="tipoEquipo"
                                    id="tipoEquipo"
                                    value={tipoEquipoSeleccionado}
                                    onChange={(e) => setTipoEquipoSeleccionado(e.target.value)}>

                                    <option value="">---Seleccione un Tipo---</option>
                                    <option value="CPU">CPU</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Tablet">Tablet</option>
                                    <option value="TodoEnUno">Todo en Uno</option>
                                </select>

                                {/*Características del Equipo (visibles solo si hay tipo de equipo seleccionado)*/}
                                {tipoEquipoSeleccionado && (
                                    <>
                                        <div className="Seleccion">
                                            <label htmlFor="almacenamiento">Almacenamiento</label>
                                        </div>

                                        <select
                                            name="almacenamiento"
                                            id="almacenamiento"
                                            value={almacenamientoSeleccionado}
                                            onChange={(e) => setAlmacenamientoSeleccionado(e.target.value)}>

                                            <option value="">---Selecciona Almacenamiento---</option>
                                            {opcionesAlmacenamiento.map(op => <option key={op} value={op}>{op}</option>)}
                                        </select>

                                        <div className="seleccion">
                                            <label htmlFor="ram">RAM</label>
                                        </div>
                                        <select
                                            name="ram"
                                            id="ram"
                                            value={ramSeleccionada}
                                            onChange={(e) => setRamSeleccionada(e.target.value)}>

                                            <option value="">---Seleccione RAM---</option>
                                            {opcionesRAM.map(op => <option key={op} value={op}>{op}</option>)}
                                        </select>

                                        <div className="seleccion">
                                            <label htmlFor="procesador">Procesador</label>
                                        </div>
                                        <select
                                            name="procesador"
                                            id="procesador"
                                            value={procesadorSeleccionado}
                                            onChange={(e) => setProcesadorSeleccionado(e.target.value)}>
                                            <option value="">---Seleccione Procesador---</option>
                                            {opcionesProcesador.map(op => <option key={op} value={op}>{op}</option>)}
                                        </select>
                                    </>
                                )}
                            </>
                        )}
                        {/* OPCIONES PARA CLASE "PERIFERICO" o "EQUIPO/PERIFERICO" */}
                        {(showPerifericoOptions) && (
                            <>
                                <div className="seleccion" style={{ marginTop: '15px' }}>
                                    <label htmlFor="tipoPeriferico">Tipo de Periférico</label>
                                </div>
                                <select
                                    name="tipoPeriferico"
                                    id="tipoPeriferico"
                                    value={tipoPerifericoSeleccionado}
                                    onChange={(e) => setTipoPerifericoSeleccionado(e.target.value)}
                                >
                                    <option value="">---Seleccione un Tipo---</option>
                                    <option value="salida">Periférico de Salida</option>
                                    <option value="entrada">Periférico de Entrada</option>
                                    <option value="almacenamiento">Periférico de Almacenamiento</option>
                                </select>
                                {/* Periférico Específico (visible solo si hay tipo de periférico seleccionado) */}
                                {tipoPerifericoSeleccionado && (
                                    <div className="seleccion" style={{ marginTop: '15px' }}>
                                        <label htmlFor="perifericoEspecifico">Periférico Específico</label>
                                        <select
                                            name="perifericoEspecifico"
                                            id="perifericoEspecifico"
                                            value={perifericoEspecificoSeleccionado}
                                            onChange={(e) => setPerifericoEspecificoSeleccionado(e.target.value)}
                                        >
                                            <option value="">---Seleccione Específico---</option>
                                            {tipoPerifericoSeleccionado === "salida" &&
                                                opcionesPerifericosSalida.map(op => <option key={op} value={op}>{op}</option>)}
                                            {tipoPerifericoSeleccionado === "entrada" &&
                                                opcionesPerifericosEntrada.map(op => <option key={op} value={op}>{op}</option>)}
                                            {tipoPerifericoSeleccionado === "almacenamiento" &&
                                                opcionesPerifericosAlmacenamiento.map(op => <option key={op} value={op}>{op}</option>)}
                                        </select>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Campo de Descripción (siempre visible) */}
                        <div className="container descripcion">
                            <textarea
                                name="descripcion"
                                id="texto-descripcion"
                                placeholder="Describa el producto a solicitar (detalles adicionales)"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    id="prioridad"
                                    checked={altaPrioridad}
                                    onChange={(e) => setAltaPrioridad(e.target.checked)}
                                /> Alta prioridad
                            </label><br />
                        </div>
                        <button type="submit">Enviar solicitud</button>
                    </form>

                    {mensajeFormulario && <p className="mensaje-formulario">{mensajeFormulario}</p>}
                </div>
            </main>

            <section className="container listado-solicitudes">
                <h2>Listado de Solicitudes Enviadas</h2>
                {/* Controles de ordenamiento y filtrado */}
                <div className="container filtros-ordenamiento">
                    <h3>Opciones de Visualización</h3>
                    <div className="control-group">
                        <label htmlFor="sortBy">Ordenar por:</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                // El cambio en 'sortBy' hará que 'fetchSolicitudes' se re-cree y el useEffect se dispare.
                            }}
                        >
                            <option value="fecha">Fecha</option>
                            <option value="estado">Estado</option>
                            <option value="prioridad">Prioridad</option>
                            <option value="tipo">Clase</option>
                        </select>

                        <label htmlFor="sortOrder">Orden:</label>
                        <select
                            id="sortOrder"
                            value={sortOrder}
                            onChange={(e) => {
                                setSortOrder(e.target.value);
                                // El cambio en 'sortOrder' hará que 'fetchSolicitudes' se re-cree y el useEffect se dispare.
                            }}
                        >
                            <option value="desc">Descendente</option>
                            <option value="asc">Ascendente</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <label htmlFor="filterPriority">Filtrar por Prioridad:</label>
                        <select
                            id="filterPriority"
                            value={filterPriority}
                            onChange={(e) => {
                                setFilterPriority(e.target.value);
                                // El cambio en 'filterPriority' hará que 'fetchSolicitudes' se re-cree y el useEffect se dispare.
                            }}
                        >
                            <option value="all">Todas</option>
                            <option value="true">Solo Alta Prioridad</option>
                            <option value="false">Solo Baja Prioridad</option>
                        </select>
                    </div>

                    <div className="control-group search-bar">
                        <label htmlFor="searchKeyword">Buscar:</label>
                        <input
                            type="text"
                            id="searchKeyword"
                            placeholder="Buscar por descripción o clase"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        {/* El botón de búsqueda ahora llama directamente a fetchSolicitudes,
                            lo cual es útil si quieres que la búsqueda se active solo con un click,
                            en lugar de cada vez que se teclea una letra.
                        */}
                        <button onClick={fetchSolicitudes}>Aplicar Búsqueda</button>
                        {searchKeyword && (
                            <button onClick={() => {
                                setSearchKeyword('');
                                fetchSolicitudes(); // Limpiar el campo y recargar el listado
                            }}>X</button>
                        )}
                    </div>
                </div>
                {/* Fin de Controles de ordenamiento y filtrado */}

                {cargandoSolicitudes ? (
                    <p>Cargando solicitudes...</p>
                ) : errorListado ? (
                    <p className="error-mensaje">{errorListado}</p>
                ) : solicitudes.length === 0 ? (
                    <p>No hay solicitudes enviadas aún.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Clase</th>
                                <th>Descripción</th>
                                <th>Prioridad</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map((solicitud) => (
                                <tr key={solicitud.id}>
                                    <td>{solicitud.id}</td>
                                    <td>{solicitud.tipoSolicitud}</td>
                                    <td>{solicitud.descripcion}</td>
                                    <td>{solicitud.altaPrioridad ? 'Sí' : 'No'}</td>
                                    <td>{new Date(solicitud.fechaSolicitud).toLocaleString()}</td>
                                    <td>{solicitud.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};
export default ComprasForm;
