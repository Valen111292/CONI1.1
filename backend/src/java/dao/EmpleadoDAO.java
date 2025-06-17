package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import Conexion.Conexion;
import modelo.EmpleadoVO;
        
public class EmpleadoDAO {
    
    public boolean registrarEmpleado(EmpleadoVO emp){
        boolean registrado = false;
        
        try (Connection conn = Conexion.getConnection()){
            
            String prefijo = obtenerPrefijoCargo(emp.getCargo());
            String queryId = "SELECT COUNT(*) AS total FROM empleados WHERE cargo = ?";
            PreparedStatement psContador = conn.prepareStatement(queryId);
            psContador.setString(1, emp.getCargo());
            ResultSet rs = psContador.executeQuery();
            int total = 1;
            if (rs.next()){
                total = rs.getInt("total") + 1;
            }
            String idGenerado = prefijo + String.format("%02d", total);
            
            String sql = "INSERT INTO empleados (id_empleado, nombre, cedula, email, cargo) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, idGenerado);
            ps.setString(2, emp.getNombre());
            ps.setString(3, emp.getCedula());
            ps.setString(4, emp.getEmail());
            ps.setString(5, emp.getCargo());
            
            registrado = ps.executeUpdate() > 0;
            
        } catch (SQLException e){
            e.printStackTrace();
        }
        return registrado;
    }
    
    public boolean solicitarEquipo(String cedula) {
        boolean actualizado = false;
        
        try (Connection con = Conexion.getConnection()) {
            String sql = "UPDATE empleados SET solicito_equipo = TRUE WHERE cedula = ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, cedula);
            actualizado = ps.executeUpdate() > 0;
        }catch (SQLException e) {
            e.printStackTrace();
        }
        return actualizado;
    }
    
    private String obtenerPrefijoCargo(String cargo){
        switch (cargo.toLowerCase()){
            case "auxiliar de logistica": return "LOG";
            case "aprendiz": return "APR";
            case "ejecutivo(a) de ventas": return "VEN";
            case "tesorero": return "TES";
            case "gerente de distribuciones": return "GER";
            default: return "EMP";
        }
    }
}
