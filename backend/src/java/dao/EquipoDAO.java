package dao;

import Conexion.Conexion;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import modelo.EquipoVO;

public class EquipoDAO {

    public List<EquipoVO> listarTodos(String filtroEstado) {
        List<EquipoVO> lista = new ArrayList<>();
        String sql = "SELECT * FROM equipos_perifericos";
        if (filtroEstado != null && !filtroEstado.isEmpty()) {
            sql += " WHERE estado = ?";
        }

        try (Connection con = Conexion.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            if (filtroEstado != null && !filtroEstado.isEmpty()) {
                ps.setString(1, filtroEstado);
            }

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                EquipoVO e = new EquipoVO(
                    rs.getString("n_inventario"),
                    rs.getString("n_serie"),
                    rs.getString("clase"),
                    rs.getString("marca"),
                    rs.getString("ram"),
                    rs.getString("disco"),
                    rs.getString("procesador"),
                    rs.getString("estado")
                );
                lista.add(e);
            }
        } catch (Exception e) {
        }

        return lista;
    }

    public boolean registrar(EquipoVO equipo) {
        String sql = "INSERT INTO equipos_perifericos VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection con = Conexion.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, equipo.getN_inventario());
            ps.setString(2, equipo.getN_serie());
            ps.setString(3, equipo.getClase());
            ps.setString(4, equipo.getMarca());
            ps.setString(5, equipo.getRam());
            ps.setString(6, equipo.getDisco());
            ps.setString(7, equipo.getProcesador());
            ps.setString(8, equipo.getEstado());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean eliminar(String n_inventario) {
        String sql = "DELETE FROM equipos_perifericos WHERE n_inventario=?";
        try (Connection con = Conexion.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, n_inventario);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean actualizar(EquipoVO equipo) {
        String sql = "UPDATE equipos_perifericos SET n_serie=?, clase=?, marca=?, ram=?, disco=?, procesador=?, estado=? WHERE n_inventario=?";
        try (var con = Conexion.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, equipo.getN_serie());
            ps.setString(2, equipo.getClase());
            ps.setString(3, equipo.getMarca());
            ps.setString(4, equipo.getRam());
            ps.setString(5, equipo.getDisco());
            ps.setString(6, equipo.getProcesador());
            ps.setString(7, equipo.getEstado());
            ps.setString(8, equipo.getN_inventario());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            return false;
        }
    }
}
