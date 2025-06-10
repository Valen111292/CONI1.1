<%-- 
    Document   : perfilAdmin
    Created on : 12/05/2025, 7:40:01 p. m.
    Author     : ansap
--%>

<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
response.setHeader("Pragma", "no-cache");
response.setDateHeader("Expires", 0);
%>

<%    if (session == null || session.getAttribute("UsuarioLogueado") == null) {
        response.sendRedirect("sesion.jsp");
        return;
    }

    String rol = (String) session.getAttribute("rol");
    if (!"admin".equals(rol)) {
        response.sendRedirect("sinAcceso.jsp");
        return;
    }

%>

<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CONI</title>
        <link rel="stylesheet" href="CSS/perfilAdmin.css">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </head>

    <body>
        <header class="encabezado">
            <img src="img/ESLOGAN CONI.png" alt="Eslogan de CONI - Gestión de inventario" class="imagen-encabezado">
            <div class="barra-superior">
                <nav>
                    <ul>
                        <li><a href="cambiarPassword.jsp">Cambiar contraseña</a></li>
                        <li><a href="LogoutServlet">Cerrar sesión</a></li>                        
                    </ul>
                </nav>
            </div>
        </header>

        <h2 class="titulo perfil-administrador">¿Que deseas gestionar hoy?</h2>

        <main class="contenido">
            <div class="container gestion-administrador">
                <div class="gestion-usuario">
                    <a href="gestionUsuario.jsp"><img src="img/gestionar usuario.gif"></a>
                    <div class="container text-usuarios">
                        <button><a href="gestionUsuario.jsp">Usuarios</a></button>
                        <p>Administra y controla los perfiles de acceso al sistema</p>
                    </div>
                </div>
                <div class="informe">
                    <a href="generar-informe.html"><img src="img/generar informe.gif" alt=""></a>
                    <div class="container text-informe">
                        <button><a href="generar-informe.html">Generar informe</a></button>
                        <p>Obtener informes detallados sobre el estado del inventario</p>
                    </div>
                </div>
            </div>
        </main>


    </body>

</html>
