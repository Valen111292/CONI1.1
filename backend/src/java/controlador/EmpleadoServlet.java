package controlador;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import modelo.EmpleadoVO;
import dao.EmpleadoDAO;

/**
 *
 * @author ansap
 */
@WebServlet("/EmpleadoServlet")
public class EmpleadoServlet extends HttpServlet {

    private EmpleadoDAO empleadoDAO = new EmpleadoDAO();
    private Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/plain;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");

        BufferedReader reader = request.getReader();
        EmpleadoVO empleado = gson.fromJson(reader, EmpleadoVO.class);
        PrintWriter out = response.getWriter();

        String accion = request.getParameter("accion");
        if (accion == null && request.getReader() != null) {
            //intenta detectar si viene la accion dentro del Json
            accion = empleado.getClass().getSimpleName().contains("solicito_equipo") || empleado.getCargo() == null ? "solicitar_equipo" : "registrar";
        } if ("solicitar_equipo".equalsIgnoreCase(accion) || empleado.isSolicito_equipo()){
            boolean actualizado = empleadoDAO.solicitarEquipo(empleado.getCedula());
            if (actualizado) {
                out.print("Solicitud de equipo registrada con éxito.");
            } else {
                out.print("Error al registrar la solicitud de equipo.");
            }
        } else {
            boolean registrado = empleadoDAO.registrarEmpleado(empleado);
            if (registrado) {
                out.print("Empleado registrado correctamente.");
            } else{
                out.print("Error al registrar el empleado.");
            }
        }
    }

}
