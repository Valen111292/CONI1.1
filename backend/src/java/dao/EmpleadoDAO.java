package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import Conexion.Conexion;
import modelo.EmpleadoVO;
import java.util.List;
import java.util.ArrayList;

public class EmpleadoDAO {

    public boolean registrarEmpleado(EmpleadoVO emp) {
        boolean registrado = false;

        try (Connection conn = Conexion.getConnection()) {

            String idGenerado = emp.getId_empleado();
            if(idGenerado == null || idGenerado.isEmpty()){
            String prefijo = obtenerPrefijoCargo(emp.getCargo());
            String queryId = "SELECT COUNT(*) AS total FROM empleados WHERE cargo = ?";
            PreparedStatement psContador = conn.prepareStatement(queryId);
            psContador.setString(1, emp.getCargo());
            ResultSet rs = psContador.executeQuery();
            int total = 1;
            if (rs.next()) {
                total = rs.getInt("total") + 1;
            }
            idGenerado = prefijo + String.format("%02d", total);
}
            String sql = "INSERT INTO empleados (id_empleado, nombre, cedula, email, cargo) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, idGenerado);
            ps.setString(2, emp.getNombre());
            ps.setString(3, emp.getCedula());
            ps.setString(4, emp.getEmail());
            ps.setString(5, emp.getCargo());

            registrado = ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            System.err.println("Error SQL al registrar empleado: " + e.getMessage());
        }
        return registrado;
    }

    private String obtenerPrefijoCargo(String cargo) {
        switch (cargo.toLowerCase()) {
            case "auxiliar de logistica":
                return "LOG";
            case "aprendiz":
                return "APR";
            case "ejecutivo(a) de ventas":
                return "VEN";
            case "tesorero":
                return "TES";
            case "gerente de distribuciones":
                return "GER";
            default:
                return "EMP";
        }
    }

    public List<EmpleadoVO> listarEmpleados() {
        List<EmpleadoVO> lista = new ArrayList<>();
        String sql = "SELECT id_empleado, nombre, cedula, email, cargo FROM empleados";

        try (Connection conn = Conexion.getConnection(); PreparedStatement ps = conn.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                EmpleadoVO emp = new EmpleadoVO();
                emp.setId_empleado(rs.getString("id_empleado"));
                emp.setNombre(rs.getString("nombre"));
                emp.setCedula(rs.getString("cedula"));
                emp.setEmail(rs.getString("email"));
                emp.setCargo(rs.getString("cargo"));
                lista.add(emp);
            }

        } catch (SQLException e) {
            e.printStackTrace(); // Manejo de errores
            System.err.println("Error SQL al listar empleado: " + e.getMessage());
        }
        return lista;
    }

    public EmpleadoVO obtenerEmpleadoPorCedula(String cedula) {
        EmpleadoVO emp = null;
        String sql = "SELECT id_empleado, nombre, cedula, email, cargo FROM empleados WHERE cedula = ?";

        try (Connection conn = Conexion.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, cedula);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    emp = new EmpleadoVO();
                    emp.setId_empleado(rs.getString("id_empleado"));
                    emp.setNombre(rs.getString("nombre"));
                    emp.setCedula(rs.getString("cedula"));
                    emp.setEmail(rs.getString("email"));
                    emp.setCargo(rs.getString("cargo"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.err.println("Error SQL al obtener empleado por cédula: " + e.getMessage());
        }
        return emp;
    }

    public boolean actualizarEmpleado(EmpleadoVO emp) {
        boolean actualizado = false;
        // Nota: El id_empleado y el cargo no se actualizan aquí para mantener la consistencia del ID generado.
        // Solo se actualiza nombre e email.
        String sql = "UPDATE empleados SET nombre = ?, email = ?, cargo = ? WHERE cedula = ?";

        try (Connection conn = Conexion.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, emp.getNombre());
            ps.setString(2, emp.getEmail());
            ps.setString(3, emp.getCargo());
            ps.setString(4, emp.getCedula());

            actualizado = ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            System.err.println("Error SQL al actualizar empleado: " + e.getMessage());
        }
        return actualizado;
    }

    public boolean eliminarEmpleado(String cedula) {
        boolean eliminado = false;
        String sql = "DELETE FROM empleados WHERE cedula = ?";

        try (Connection conn = Conexion.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, cedula);
            eliminado = ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            System.err.println("Error SQL al eliminar empleado: " + e.getMessage());
        }
        return eliminado;
    }

}
