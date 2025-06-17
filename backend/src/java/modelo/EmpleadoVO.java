package modelo;

public class EmpleadoVO {

    private String id_empleado;
    private String nombre;
    private String cedula;
    private String email;
    private String cargo;
    private boolean solicito_equipo;
    private String usuario_asociado;

    public EmpleadoVO() {
    }

    public EmpleadoVO(String id_empleado, String nombre, String cedula, String email, String cargo, boolean solicito_equipo, String usuario_asociado) {
        this.id_empleado = id_empleado;
        this.nombre = nombre;
        this.cedula = cedula;
        this.email = email;
        this.cargo = cargo;
        this.solicito_equipo = solicito_equipo;
        this.usuario_asociado = usuario_asociado;
    }

    public String getId_empleado() {
        return id_empleado;
    }

    public void setId_empleado(String id_empleado) {
        this.id_empleado = id_empleado;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }
    
    public boolean isSolicito_equipo() {
        return solicito_equipo;
    }

    public void setSolicito_equipo(boolean solicito_equipo) {
        this.solicito_equipo = solicito_equipo;
    }

     public String getUsuario_asociado() {
        return usuario_asociado;
    }

    public void setUsuario_asociado(String usuario_asociado) {
        this.usuario_asociado = usuario_asociado;
    }
    
}
