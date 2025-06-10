<%-- 
    Document   : gestionarUsuario
    Created on : 13/05/2025, 5:14:33 p. m.
    Author     : ansap
--%>

<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    HttpSession sesion = request.getSession(false);
    if (sesion == null || sesion.getAttribute("UsuarioLogueado") == null) {
        response.sendRedirect("sesion.jsp");
        return;
    }

    // Evitar caché del navegador
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0
    response.setDateHeader("Expires", 0); // Proxies
%>
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CONI</title>
        <link rel="stylesheet" href="CSS/gestionarUsuario.css">
    </head>

    <body>
        <section class="encabezado">
            <img src="img/ESLOGAN CONI.png" alt="Eslogan de CONI - Gestión de inventario" class="imagen-encabezado">
            <div class="barra-superior">
                <nav>
                    <ul>
                        <li><a href="perfilAdmin.jsp">Perfil Administrador</a></li>
                        <li><a href="LogoutServlet">Cerrar sesión</a></li>
                    </ul>
                </nav>
            </div>
        </section>

        <header>
            <div class="container botones-principales">
                <button class="nuevo-usuario" type="button" id="nuevoUsuario"><a href="crearUsuario.jsp">Nuevo
                    empleado</a></button>
                <button class="actualizar-usuario" type="button"
                        id="actualizarUsuario"><a href="modificarUsuario.jsp">Modificar empleado</a></button>
            </div>
        </header>
       
    </body>

</html>
