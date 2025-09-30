# Usa la imagen base de Tomcat
FROM tomcat:9.0-jre17-temurin

# ----------------------------------------------------
# CONFIGURACIÓN DE DESPLIEGUE
# ----------------------------------------------------

# Elimina la aplicación ROOT por defecto de Tomcat
RUN rm -rf /usr/local/tomcat/webapps/ROOT

# Copia el archivo .war *desde* la carpeta 'dist'
# y lo nombra ROOT.war para que se sirva en la URL base (sin /CONI1.0)
# ¡CRUCIAL!: Tu archivo .war DEBE estar en la carpeta 'backend/dist' en GitHub.
COPY dist/CONI1.0.war /usr/local/tomcat/webapps/ROOT.war

# El puerto por defecto es 8080
EXPOSE 8080

# Comando para iniciar Tomcat
CMD ["catalina.sh", "run"]
