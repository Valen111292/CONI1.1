<%-- 
    Document   : gestionarUsuario
    Created on : 13/05/2025, 5:14:33 p. m.
    Author     : ansap
--%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
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
<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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

        <form class="buscar" action="BuscarUsuarioServlet" method="get">
            <label for="cedulaBusqueda">Buscar por cédula:</label>
            <input type="text" id="cedulaBusqueda" name="cedulaBusqueda" required>
            <button type="submit">Buscar</button>
        </form>

        <!-- Mostrar mensaje si no se encuentra usuario -->
        <c:if test="${not empty mensaje}">
            <p style="color:red;">${mensaje}</p>
        </c:if>

        <main>

            <div class="modificar-empleado" id="modUsuario">

                <h2>Modificar empleado</h2>

                <form action="ModificarUsuarioServlet" method="post">
                    <input type="hidden" name="id" value="${usuarioEncontrado.id}" />

                    <label for="nombre">Nombre y apellidos:</label>
                    <input type="text" id="nombre" name="nombre" value="${usuarioEncontrado.nombre}"
                           placeholder="ingrese el nombre y apellidos" required><br>

                    <label for="cedula">Cédula:</label>
                    <input type="text" id="cedula" name="cedula" value="${usuarioEncontrado.cedula}" placeholder="ingrese N° cédula" readonly required><br>

                    <label for="rol">Rol a desempeñar:</label>
                    <select name="rol" id="rol" placeholder="Seleccione un rol" required=""> 
                        <option value="admin" ${usuarioEncontrado.rol == 'admin' ? 'selected' : ''}>Administrador</option>
                        <option value="usuario" ${usuarioEncontrado.rol == 'usuario' ? 'selected' : ''}>Usuario</option>
                    </select><br>

                    <input type="hidden" name="username" value="${usuarioEncontrado.username}" />

                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" value="${usuarioEncontrado.password}"
                           placeholder="ingrese una contraseña" required><br>

                    <label for="email">Correo electrónico:</label>
                    <input type="email" id="email" name="email" value="${usuarioEncontrado.email}" placeholder="ingrese el e-mail" required><br>

                    <button type="submit" name="accion" value="modificar">Modificar usuario</button>
                    <button type="submit" name="accion" value="eliminar" onclick="return confirm('¿Seguro que deseas eliminar este usuario?');">Eliminar</button>
                </form>

            </div>
        </main>

    </body>

</html>
