/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controlador;

import dao.UsuarioDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import modelo.Usuario;
import com.google.gson.Gson;
import java.io.BufferedReader;

@WebServlet("/CrearUsuarioServlet")
public class CrearUsuarioServlet extends HttpServlet {

    private final Gson gson = new Gson(); //instancia de Gson para parsear JSON.
    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        StringBuilder sb = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"status\": \"error\", \"message\": \"Error al leer el cuerpo de la solicitud.\"}");
            e.printStackTrace();
            return;
        }

        String jsonRecibido = sb.toString();
        System.out.println("JSON recibido: " + jsonRecibido); // log para depuración.

        try {
            // convertir el JSON a un objeto usuario
            Usuario nuevoUsuario = gson.fromJson(jsonRecibido, Usuario.class);

            if (nuevoUsuario == null || nuevoUsuario.getNombre() == null || nuevoUsuario.getNombre().isEmpty()
                    || nuevoUsuario.getCedula() == null || nuevoUsuario.getCedula().isEmpty()
                    || nuevoUsuario.getRol() == null || nuevoUsuario.getRol().isEmpty()
                    || nuevoUsuario.getUsername() == null || nuevoUsuario.getUsername().isEmpty()
                    || nuevoUsuario.getEmail() == null || nuevoUsuario.getEmail().isEmpty()
                    || nuevoUsuario.getPassword() == null || nuevoUsuario.getPassword().isEmpty()) {

                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"status\":\"error\",\"message\":\"Datos de usuario incompletos o inválidos.\"}");
                return;
            }

            // --- VALIDACIÓN DE CÉDULA ---
            if (usuarioDAO.existeUsuarioConCedula(nuevoUsuario.getCedula())) {
                response.setStatus(HttpServletResponse.SC_CONFLICT); // 409 Conflict: El recurso ya existe
                response.getWriter().write("{\"status\":\"error\",\"message\":\"Ya existe un usuario con la cédula proporcionada.\"}");
                return; // Detiene la ejecución si la cédula ya existe
            }

            boolean registrado = usuarioDAO.insertar(nuevoUsuario);

            if (registrado) {
                response.setStatus(HttpServletResponse.SC_CREATED); // 201 Created es más apropiado para creaciones exitosas
                response.getWriter().write("{\"status\":\"ok\",\"message\":\"Usuario creado exitosamente.\"}");
            } else {
                // Podría ser un conflicto (ej. usuario o cédula ya existen) o algún otro error del DAO
                response.setStatus(HttpServletResponse.SC_CONFLICT); // O 400 Bad Request si la inserción falló por datos inválidos únicos
                response.getWriter().write("{\"status\":\"error\",\"message\":\"No se pudo crear el usuario. Posiblemente la cédula o el nombre de usuario ya existen o hubo un problema en la base de datos.\"}");
            }

        } catch (com.google.gson.JsonSyntaxException e) {
            // Error si el JSON no tiene el formato esperado
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"status\":\"error\",\"message\":\"Formato JSON inválido.\"}");
            e.printStackTrace();
        } catch (Exception e) {
            // Cualquier otra excepción inesperada
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"status\":\"error\",\"message\":\"Error interno del servidor al crear usuario: " + e.getMessage() + "\"}");
        }
    }

}
