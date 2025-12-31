# Stage 1: Build
FROM maven:eclipse-temurin AS builder

WORKDIR /app

# Copy pom.xml first to leverage caching
COPY pom.xml .

# Copy source code
COPY src ./src

# Build executable JAR (skip tests)
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the Spring Boot executable JAR
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
