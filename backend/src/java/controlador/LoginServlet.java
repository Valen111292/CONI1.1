package controlador;

import dao.UsuarioDAO;
import modelo.Usuario; // Asegúrate de que esta importación sea correcta para tu clase Usuario
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.annotation.WebServlet;
import java.io.IOException;
import java.io.PrintWriter;
import org.json.JSONObject;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();

        try {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = request.getReader().readLine()) != null) {
                sb.append(line);
            }
            String jsonString = sb.toString();
            JSONObject jsonRequest = new JSONObject(jsonString);

            String username = jsonRequest.getString("username");
            String password = jsonRequest.getString("password");
            String rolSeleccionado = jsonRequest.getString("rol");

            UsuarioDAO dao = new UsuarioDAO();
            Usuario usuario = dao.validar(username, password);

// Validar que el usuario existe y que el rol de autenticación coincide con lo que seleccionó en el frontend
            if (usuario != null && usuario.getRol().equals(rolSeleccionado)) {
                HttpSession session = request.getSession(true);
                session.setAttribute("idUsuario", usuario.getId());
                session.setAttribute("rolAutenticacion", usuario.getRol()); // Aquí cambió de rol a rolAutenticación
                session.setAttribute("cargoEmpleado", usuario.getCargoEmpleado()); // Aquí se defin el cargo del epleado encontrado
                session.setAttribute("username", usuario.getUsername());

                jsonResponse.put("success", true);
                jsonResponse.put("message", "Login exitoso");
                
                //Enviar la información del usuario al frontend
                JSONObject userData = new JSONObject();
                userData.put("id", usuario.getId());
                userData.put("rolAutenticacion", usuario.getRol()); // Rol de la tabla usuario
                userData.put("cargoEmpleado", usuario.getCargoEmpleado()); // cargo de la tabla empleados
                userData.put("username", usuario.getUsername());
                jsonResponse.put("user", userData);

                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Usuario, contraseña o rol incorrectos.");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
        } catch (org.json.JSONException e) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Formato de solicitud JSON inválido o campos faltantes.");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            e.printStackTrace();

        } catch (Exception e) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Error interno del servidor: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();

        } finally {
            out.print(jsonResponse.toString());
            out.flush();
        }
    }

}
