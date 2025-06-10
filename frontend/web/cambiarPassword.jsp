<%-- 
    Document   : cambiarContraseña
    Created on : 17/05/2025, 11:11:04 p. m.
    Author     : ansap
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
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
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cambiar Contraseña</title>
        <link rel="stylesheet" href="CSS/cambiarPassword.css">
    </head>
    <body>
        
        <section class="encabezado">
            <img src="img/ESLOGAN CONI.png" alt="Eslogan de CONI - Gestión de inventario" class="imagen-encabezado">
            <div class="barra-superior">
                <nav>
                    <ul>
                        <li><a href="perfilAdmin.jsp">Perfil Administrador</a></li>
                    </ul>
                </nav>
            </div>
        </section>
        
        <div class="cambiarContraseña">
        <h2>Cambiar Contraseña</h2>
        
        <p>${mensaje}</p>
        
        <form action="CambiarPasswordServlet" method="post">
            <label for="actual">Contraseña actual</label><br>
            <input type="password" id="actual" name="actual" placeholder="Ingrese su contraseña actual" required><br><br>
            
            <label for="nueva">Nueva contraseña</label><br>
            <input type="password" id="nueva" name="nueva" placeholder="Ingrese su nueva contraseña" required><br><br>
            
            <label for="confirmar">Confirma nueva contraseña</label><br>
            <input type="password" id="confirmar" name="confirmar" placeholder="Confirme su nueva contraseña" required><br><br>
            
            <button type="submit">Actualizar contraseña</button>
        </form>
        
        
        
        </div>
        
    </body>
</html>
