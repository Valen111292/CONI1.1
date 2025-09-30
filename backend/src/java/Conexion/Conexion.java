package Conexion;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.net.URI;
import java.net.URISyntaxException;

public class Conexion {

    // Ya no usamos variables estáticas aquí, leemos de Render.

    public static Connection getConnection() throws SQLException {
        // 1. OBTENER LA URL DE RENDER
        // Render proporciona la URL completa en la variable DATABASE_URL
        String databaseUrl = System.getenv("DATABASE_URL"); 

        if (databaseUrl == null) {
            // Opción de reserva si la variable de entorno no está configurada (ej. prueba local)
            // Cambiamos a la URL local de PostgreSQL
            databaseUrl = "jdbc:postgresql://localhost:5432/conibd"; 
        }

        try {
            // 2. CARGAR EL DRIVER DE POSTGRESQL
            Class.forName("org.postgresql.Driver"); 
            
            // 3. PROCESAR LA URL COMPLEJA DE RENDER
            // La URL de Render es un URI que contiene usuario y contraseña
            URI dbUri = new URI(databaseUrl);
            
            // Extraer usuario y contraseña del URI
            String username = dbUri.getUserInfo().split(":")[0]; 
            String password = dbUri.getUserInfo().split(":")[1]; 
            
            // Construir la URL en el formato simple que necesita JDBC: jdbc:postgresql://host:port/db
            String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ":" + dbUri.getPort() + dbUri.getPath();

            // 4. ESTABLECER LA CONEXIÓN
            return DriverManager.getConnection(dbUrl, username, password);

        } catch (URISyntaxException e) {
            throw new SQLException("Error al procesar la URL de la Base de Datos: " + e.getMessage(), e);
        } catch (ClassNotFoundException e) {
            throw new SQLException("Error al cargar el Driver PostgreSQL", e);
        }
    }
}