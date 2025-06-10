package controlador;

import com.google.gson.Gson;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import modelo.EquipoVO;
import dao.EquipoDAO;

@WebServlet("/EquipoServlet")
public class EquipoServlet extends HttpServlet {

    private final EquipoDAO dao = new EquipoDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Habilitar CORS para preflight requests
        addCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        addCorsHeaders(response);
        response.setContentType("application/json");

        String estado = request.getParameter("estado");
        List<EquipoVO> lista = dao.listarTodos(estado);

        String json = gson.toJson(lista);
        PrintWriter out = response.getWriter();
        out.print(json);
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        addCorsHeaders(response);
        response.setContentType("application/json");

        BufferedReader reader = request.getReader();
        EquipoVO equipo = gson.fromJson(reader, EquipoVO.class);
        boolean resultado = dao.registrar(equipo);

        response.setStatus(resultado ? HttpServletResponse.SC_CREATED : HttpServletResponse.SC_BAD_REQUEST);
        PrintWriter out = response.getWriter();
        out.print("{\"success\": " + resultado + "}");
        out.flush();
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        addCorsHeaders(response);
        response.setContentType("application/json");

        String n_inventario = request.getParameter("n_inventario");

        boolean resultado = dao.eliminar(n_inventario);
        response.setStatus(resultado ? HttpServletResponse.SC_OK : HttpServletResponse.SC_BAD_REQUEST);

        PrintWriter out = response.getWriter();
        out.print("{\"success\": " + resultado + "}");
        out.flush();
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        addCorsHeaders(response);
        response.setContentType("application/json");

        BufferedReader reader = request.getReader();
        EquipoVO equipo = gson.fromJson(reader, EquipoVO.class);
        boolean resultado = dao.actualizar(equipo);

        response.setStatus(resultado ? HttpServletResponse.SC_OK : HttpServletResponse.SC_BAD_REQUEST);
        PrintWriter out = response.getWriter();
        out.print("{\"success\": " + resultado + "}");
        out.flush();
    }

    private void addCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Cambia esto si usas otro puerto
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
