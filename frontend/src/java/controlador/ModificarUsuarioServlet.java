/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controlador;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modelo.Usuario;
import dao.UsuarioDAO;

/**
 *
 * @author ansap
 */
@WebServlet("/ModificarUsuarioServlet")
public class ModificarUsuarioServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String accion = request.getParameter("accion");
        int id = Integer.parseInt(request.getParameter("id"));

        UsuarioDAO usuarioDAO = new UsuarioDAO();
        Usuario usuarios = new Usuario();

        if ("modificar".equals(accion)) {

            String nombre = request.getParameter("nombre");
            String cedula = request.getParameter("cedula");
            String rol = request.getParameter("rol");
            String username = request.getParameter("username");
            String email = request.getParameter("email");
            String password = request.getParameter("password");

            // Crear objeto Usuario
            usuarios.setId(id);
            usuarios.setNombre(nombre);
            usuarios.setCedula(cedula);
            usuarios.setRol(rol);
            usuarios.setUsername(username);
            usuarios.setEmail(email);
            usuarios.setPassword(password);

            boolean modificar = usuarioDAO.modificar(usuarios);

            if (modificar) {
                request.setAttribute("mensaje", "Usuario modificado correctamente.");
            } else {
                request.setAttribute("mensaje", "Error al modificar el usuario.");
            }

        } else if ("eliminar".equals(accion)) {

            Usuario usuarioLogueado = (Usuario) request.getSession().getAttribute("UsuarioLogueado");

            // Validar si el usuario logueado está intentando eliminarse a sí mismo
            if (usuarioLogueado != null && usuarioLogueado.getId() == id) {
                request.setAttribute("mensaje", "No puedes eliminar tu propio usuario.");
                request.getRequestDispatcher("modificarUsuario.jsp").forward(request, response);
                return;
            }
            boolean eliminado = usuarioDAO.eliminarUsuario(id);
            if (eliminado) {
                request.setAttribute("mensaje", "Usuario eliminado correctamente.");
                // Quizás limpiar el usuario encontrado para que no muestre datos
                request.removeAttribute("usuarioEncontrado");
            } else {
                request.setAttribute("mensaje", "Error al eliminar el usuario.");
            }
            // Redireccionar a la misma página o a una de confirmación
            request.getRequestDispatcher("modificarUsuario.jsp").forward(request, response);
        }
    }
}
