# syntax=docker/dockerfile:1.7

# Build stage
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app

# Leverage Maven wrapper
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Copy sources and build
COPY src ./src
RUN ./mvnw -q -B -DskipTests=true package

# Runtime stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Default to empty; override via runtime env or docker-compose
ENV GOOGLE_API_KEY=""

# Copy the built jar and rename to a stable name
# Assumes a single jar is built in target/
COPY --from=builder /app/target/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]
