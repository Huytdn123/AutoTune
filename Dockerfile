# =========================================================================
# VIRTUAL TUNE - Backend Multi-Stage Dockerfile (Java 25)
# Context: Root repository directory (Render Root Directory = .)
# =========================================================================

# Stage 1: Build Application with Eclipse Temurin JDK 25
FROM eclipse-temurin:25-jdk AS builder
WORKDIR /build

COPY backend/mvnw backend/mvnw
COPY backend/.mvn backend/.mvn
COPY backend/pom.xml backend/pom.xml

WORKDIR /build/backend
# Normalize line endings and grant execute permissions
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw
RUN ./mvnw dependency:go-offline -B || true

COPY backend/src src
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Minimal Production Runtime with Eclipse Temurin JRE 25
FROM eclipse-temurin:25-jre
WORKDIR /app

RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

COPY --from=builder /build/backend/target/*.jar app.jar

ENV PORT=10000
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 10000

ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-10000} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
