# ----------------------------------------------------
# STAGE 1: COMPILACIÓN (BUILDER)
# ----------------------------------------------------
FROM maven:3.8.6-openjdk-17 AS builder

# Directorio donde se compilará
WORKDIR /app

# Copia el código Java y el pom.xml
COPY . /app

# Compila el proyecto, generando el archivo .war en /app/target/
RUN mvn clean package -DskipTests

# ----------------------------------------------------
# STAGE 2: EJECUCIÓN (FINAL - TOMCAT)
# ----------------------------------------------------
FROM tomcat:9.0-jre17-temurin

# Elimina la app de inicio por defecto
RUN rm -rf /usr/local/tomcat/webapps/ROOT

# Copia el archivo WAR compilado desde el stage 'builder'
# Lo renombramos a ROOT.war para que tu API esté en la URL base (sin /CONI1.0)
COPY --from=builder /app/target/CONI1.0.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]
