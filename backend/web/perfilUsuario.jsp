<%-- 
    Document   : perfilUsuario
    Created on : 12/05/2025, 7:43:52 p. m.
    Author     : ansap
--%>

<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
response.setHeader("Pragma", "no-cache");
response.setDateHeader("Expires", 0);
%>

<%
    if (session == null || session.getAttribute("UsuarioLogueado") == null) {
        response.sendRedirect("login.jsp");
        return;
    }

    String rol = (String) session.getAttribute("rol");
    if (!"usuario".equals(rol)) {
        response.sendRedirect("sinAcceso.jsp"); // página de acceso denegado
        return;
    }
%>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CONI</title>
    <link rel="stylesheet" href="CSS/perfilUsuario.css">
</head>

<body>
    <section class="encabezado">
        <img src="img/ESLOGAN CONI.png" alt="Eslogan de CONI - Gestión de inventario" class="imagen-encabezado">
        <div class="barra-superior">
            <nav>
                <ul>
                    <li><a href="LogoutServlet">Cerrar sesión</a></li>
                </ul>
            </nav>
        </div>
    </section>

    <main>
        <h2 class="titulo perfil-usuario">¿Que deseas gestionar hoy?</h2>
        <div class="contenido">
            <div class="gestion-equi-perif">
                <a href="gestionar-equipo-perifericos.html"><img src="img/computadora.gif" alt=""></a>
                <div class="container text-equipos">
                    <button><a href="gestionar-equipo-perifericos.html">Equipos/Perifericos</a></button>
                </div>
            </div>
            <div class="gestion-compras">
                <a href="compras.html"><img src="img/compras.gif" alt=""></a>
                <div class="container text-compras">
                    <button><a href="compras.html">Compras</a></button>
                </div>
            </div>
            <div class="gestion-actas">
                <a href="actas.html"><img src="img/acta.gif" alt=""></a>
                <div class="container text-actas">
                    <button><a href="actas.html">Actas</a></button>
                </div>
            </div>
            <div class="gestion-empleados">
                <a href="empleados.html"><img src="img/empleados.gif" alt=""></a>
                <div class="container text-empleados">
                    <button><a href="empleados.html">Empleados</a></button>
                </div>
            </div>
            <div class="informe">
                <a href="generar-informe.html"><img src="img/generar informe.gif" alt=""></a>
                <div class="container text-informe">
                    <button><a href="generar-informe.html">Generar informe</a></button>
                </div>
            </div>
        </div>
    </main>


</body>

</html>
