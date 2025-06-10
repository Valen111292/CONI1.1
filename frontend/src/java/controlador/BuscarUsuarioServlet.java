/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controlador;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import modelo.Usuario;
import dao.UsuarioDAO;

@WebServlet("/BuscarUsuarioServlet")
public class BuscarUsuarioServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String cedula = request.getParameter("cedulaBusqueda");

        UsuarioDAO usuarioDAO = new UsuarioDAO();
        Usuario usuarios = null;

        try {
            usuarios = usuarioDAO.buscarPorCedula(cedula);
        } catch (Exception e) {
            e.printStackTrace(); // Puedes registrar el error o mostrar mensaje
            request.setAttribute("mensaje", "Error al buscar el usuario");
        }

        if (usuarios != null) {
            request.setAttribute("usuarioEncontrado", usuarios);
        } else {
            request.setAttribute("mensaje", "Usuario no encontrado");
        }

        request.getRequestDispatcher("modificarUsuario.jsp").forward(request, response);
    }
}
