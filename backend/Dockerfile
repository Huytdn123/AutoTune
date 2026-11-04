# =========================================================================
# VIRTUAL TUNE - Backend Multi-Stage Dockerfile (Java 25)
# Context: backend/ directory (Render Root Directory = backend)
# =========================================================================

# Stage 1: Build Application with Eclipse Temurin JDK 25
FROM eclipse-temurin:25-jdk AS builder
WORKDIR /build

# Copy Maven wrapper and POM to leverage Docker layer caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Normalize line endings and grant execute permissions
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw
# Pre-fetch dependencies
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and compile production JAR
COPY src src
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Minimal Production Runtime with Eclipse Temurin JRE 25
FROM eclipse-temurin:25-jre
WORKDIR /app

# Run as non-root service user for security
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copy compiled JAR
COPY --from=builder /build/target/*.jar app.jar

# Render dynamic port binding (default: 10000)
ENV PORT=10000
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 10000

# Container-aware memory allocation and dynamic port resolution
ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-10000} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
