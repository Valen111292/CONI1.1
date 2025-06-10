<%-- 
    Document   : sesion
    Created on : 12/05/2025, 7:10:35 p. m.
    Author     : ansap
--%>

<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CONI</title>
    <link rel="stylesheet" href="CSS/sesion.css">
</head>

<body>
    <header class="encabezado">
        <img src="img/ESLOGAN CONI.png" alt="Eslogan de CONI - Gestión de inventario" class="imagen-encabezado">
        <div class="barra-superior">
            <nav>
                <ul>
                    <li><a href="index.jsp">Atrás</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <div class="container textos-sesion">
            <h1 title="sesion">¡Inicia sesión!</h1>
        </div>
        <form class="inicio-sesion" action="LoginServlet" method="post">
            <h4>¿Como deseas iniciar sesión?</h4>
            <select name="rol" id="rol" required>
            <option value="">-- Selecciona un rol --</option>
            <option value="admin">Administrador</option>
            <option value="usuario">Usuario</option>
            </select>
            <h4>Usuario</h4>
            <input type="text" name="username" placeholder="Nombre de usuario" required>
            <h4>Contraseña</h4>
            <input type="password" name="password" placeholder="Contraseña" required autocomplete="current-password" />
            <h5><a href="recuperar.jsp">¿olvidaste tu contraseña?</a></h5>
            <button type="submit">Iniciar sesión</button>
        </form>
    </main>
</body>

</html>
