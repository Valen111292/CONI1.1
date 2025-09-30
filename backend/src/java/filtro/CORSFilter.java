package filtro; // Verifica que este sea tu paquete correcto

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// *****************************************************************
// IMPORTANTE: Hemos eliminado la anotación @WebFilter para forzar 
// el mapeo en web.xml y evitar conflictos de versión con Tomcat 9.
// *****************************************************************

public class CORSFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // *************** ORIGEN CORREGIDO ***************
        // Permite el acceso SÓLO desde tu Frontend de Render
        String allowedOrigin = "https://coni1-0frontend.onrender.com";
        // **************************************************

        // Añadir headers CORS comunes a TODAS las respuestas
        response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
        response.setHeader("Vary", "Origin"); 
        response.setHeader("Access-Control-Max-Age", "3600"); // 1 hora

        // Responder directamente a la petición OPTIONS (preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().flush();
            return;
        }

        // Continuar con la cadena de filtros/servlets para los demás métodos
        chain.doFilter(req, res);
    }

    @Override
    public void init(FilterConfig filterConfig) {}

    @Override
    public void destroy() {}
}
