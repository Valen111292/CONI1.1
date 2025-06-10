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

        <main>
            <div class="container gestion-empleado">

                <div class="nuevo-empleado" id="nuevoEmpleado">
                    <h2>Crear usuario</h2>
                    <form id="crear-usuario" action="CrearUsuarioServlet" method="post">

                        <label for="crearNombre">Nombre y apellidos:</label>
                        <input type="text" id="Nombre" name="nombre" placeholder="ingrese el nombre y apellidos" required><br>

                        <label for="crearCedula">Cédula:</label>
                        <input type="number" id="Cedula" name="cedula" placeholder="ingrese N° cédula " required><br>

                        <label for="rol">Rol a desempeñar:</label>
                        <select name="rol" id="rol" placeholder="Seleccione un rol" required> 
                            <option value="">-- Selecciona un rol --</option>
                            <option value="admin">Administrador</option>
                            <option value="usuario">Usuario</option>
                        </select><br>

                        <label for="crearUsuario">Usuario:</label>
                        <input type="text" id="username" name="username" placeholder="ingrese el usuario" required><br>

                        <label for="crearEmail">Correo electrónico:</label>
                        <input type="email" id="email" name="email" placeholder="ingrese el e-mail" required><br>

                        <label for="crearPassword">Contraseña:</label>
                        <input type="password" id="password" name="password"
                               placeholder="ingrese una contraseña" required><br>

                        <button type="submit">Crear usuario</button>
                    </form>

                </div>

            </div>
        </main>
        <script>
            function nuevoUsuario() {
                document.querySelector("header").style.display = "none";
                document.getElementById("nuevoEmpleado").style.display = "block";
                document.getElementById("modUsuario").style.display = "none";
            }

            function actualizarUsuario() {
                document.querySelector("header").style.display = "none";
                document.getElementById("nuevoEmpleado").style.display = "none";
                document.getElementById("modUsuario").style.display = "block";
            }

            function cargarDatosUsuario(nombre, cedula, rol, email, password) {
                document.getElementById('cedulaOriginal').value = cedula;
                document.getElementById('nuevoNombre').value = nombre;
                document.getElementById('nuevaCedula').value = cedula;
                document.getElementById('rolModificar').value = rol;
                document.getElementById('nuevoEmail').value = email;
                document.getElementById('nuevoPassword').value = password;

            // Volver a vista principal
            document.querySelector("header").style.display = "block";
            document.getElementById("nuevoEmpleado").style.display = "none";
            document.getElementById("modUsuario").style.display = "none";
            }
        </script>
    </body>

</html>
