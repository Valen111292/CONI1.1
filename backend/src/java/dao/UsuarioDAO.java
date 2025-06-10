package dao;

/**
 *
 * @author ansap
 */
import modelo.Usuario;
import java.sql.Connection;
import java.sql.*;
import Conexion.Conexion;
import java.util.List;
import java.util.ArrayList;

public class UsuarioDAO {

    private final String url = "jdbc:mysql://localhost:3306/conibd";
    private final String user = "root";
    private final String password = "";

    public Usuario validar(String username, String passwordIngresada) {
        Usuario usuarios = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(url, user, password);
            String sql = "SELECT * FROM usuarios WHERE username = ? AND password = ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, username);
            ps.setString(2, passwordIngresada);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                usuarios = new Usuario();
                usuarios.setId(rs.getInt("id"));
                usuarios.setUsername(rs.getString("username"));
                usuarios.setPassword(rs.getString("password"));
                usuarios.setRol(rs.getString("rol"));
            }
            rs.close();
            ps.close();
            con.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return usuarios;
    }

    public void insertar(Usuario usuarios) throws Exception {
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = Conexion.getConnection();
            String sql = "INSERT INTO usuarios(nombre, cedula, rol, username, email, password) VALUES(?,?,?,?,?,?)";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, usuarios.getNombre());
            stmt.setString(2, usuarios.getCedula());
            stmt.setString(3, usuarios.getRol());
            stmt.setString(4, usuarios.getUsername());
            stmt.setString(5, usuarios.getEmail());
            stmt.setString(6, usuarios.getPassword());
            stmt.executeUpdate();

            System.out.println("Usuario insertado");

        } finally {
            if (stmt != null) {
                stmt.close();
            }
            if (conn != null) {
                conn.close();
            }
        }
    }

    public Usuario buscarPorCedula(String cedula) throws Exception {
        Usuario usuarios = null;
        System.out.println(">>> buscarPorCedula, cédula recibida: " + cedula);
        String sql = "SELECT * FROM usuarios WHERE cedula = ?";
        try (Connection con = Conexion.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, cedula);
            ResultSet rs = ps.executeQuery();
            System.out.println(">>> SQL ejecutado: " + ps);

            if (rs.next()) {
                usuarios = new Usuario();
                usuarios.setId(rs.getInt("id"));
                usuarios.setNombre(rs.getString("nombre"));
                usuarios.setCedula(rs.getString("cedula"));
                usuarios.setRol(rs.getString("rol"));
                usuarios.setUsername(rs.getString("username"));
                usuarios.setPassword(rs.getString("password"));
                usuarios.setEmail(rs.getString("email"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return usuarios;
    }

    public boolean modificar(Usuario usuarios) {
        String sql = "UPDATE usuarios SET nombre = ?, cedula = ?, rol = ?, username = ?, email = ?, password = ? WHERE id = ?";

        try (Connection con = Conexion.getConnection(); PreparedStatement stmt = con.prepareStatement(sql)) {

            stmt.setString(1, usuarios.getNombre());
            stmt.setString(2, usuarios.getCedula());
            stmt.setString(3, usuarios.getRol());
            stmt.setString(4, usuarios.getUsername());
            stmt.setString(5, usuarios.getEmail());
            stmt.setString(6, usuarios.getPassword());
            stmt.setInt(7, usuarios.getId());

            int filas = stmt.executeUpdate();
            return filas > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean eliminarUsuario(int id) {
        String sql = "DELETE FROM usuarios WHERE id = ?";
        try (Connection con = Conexion.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            int filas = ps.executeUpdate();
            return filas > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean cambiarContraseña(int id, String nueva) {
        String sql = "UPDATE usuarios SET password = ? WHERE id = ?";
        try (Connection con = Conexion.getConnection(); PreparedStatement stmt = con.prepareStatement(sql)) {

            stmt.setString(1, nueva);
            stmt.setInt(2, id);

            int filas = stmt.executeUpdate();
            return filas > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
