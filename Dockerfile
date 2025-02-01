# ===================================================================================
# To Add Only JAR In Container
# ===================================================================================
# Build stage
FROM gradle:8.5-jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle build --no-daemon -x test

# Run stage
FROM mcr.microsoft.com/openjdk/jdk:21-ubuntu
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]

# ===================================================================================
# To Add Code In Container
# ===================================================================================
# # Build stage
# FROM gradle:8.5-jdk21 AS build
# WORKDIR /app
# COPY . .
# RUN gradle build --no-daemon -x test

# # Run stage & Save Source Code Also
# FROM mcr.microsoft.com/openjdk/jdk:21-ubuntu
# WORKDIR /app
# COPY --from=build /app .
# EXPOSE 9090
# ENTRYPOINT ["java", "-jar", "build/libs/springbootlab-0.0.1-SNAPSHOT.jar"]

# ===================================================================================
# To Build Custom Run Time With Required Modules At Run Time In Container
# ===================================================================================
# # Build stage
# FROM gradle:8.5-jdk21 AS build
# WORKDIR /app
# COPY . .
# RUN gradle build --no-daemon -x test

# # Create custom JRE
# FROM mcr.microsoft.com/openjdk/jdk:21-ubuntu AS jre-builder
# WORKDIR /jre
# RUN jlink --output /opt/custom-jre \
#       --add-modules java.base,java.logging,java.naming,java.xml,java.net.http,java.security.jgss,java.instrument,java.management,jdk.crypto.ec,java.desktop \
#       --strip-debug \
#       --no-man-pages \
#       --no-header-files \
#       --compress=2

# # Run stage
# FROM ubuntu:22.04
# WORKDIR /app
# COPY --from=jre-builder /opt/custom-jre /opt/custom-jre
# ENV JAVA_HOME=/opt/custom-jre
# ENV PATH="$JAVA_HOME/bin:${PATH}"
# COPY --from=build /app/build/libs/*.jar app.jar
# EXPOSE 9090
# ENTRYPOINT ["java", "-jar", "app.jar"]

# ===================================================================================
# To Build Custom Run Time With Finding Required Modules At Run Time In Container
# ===================================================================================
# # Build stage
# FROM gradle:8.5-jdk21 AS build
# WORKDIR /app
# COPY . .
# RUN gradle build --no-daemon -x test

# # Module analyzer stage
# FROM mcr.microsoft.com/openjdk/jdk:21-ubuntu AS analyzer
# WORKDIR /analyzer
# COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar
# RUN jdeps \
#     --ignore-missing-deps \
#     --multi-release 21 \
#     --print-module-deps \
#     --class-path 'app.jar' \
#     --recursive \
#     app.jar > modules.txt && \
#     echo "$(cat modules.txt),java.logging,java.sql,java.naming,java.management,java.desktop,java.xml,java.transaction.xa,jdk.crypto.ec,java.net.http,java.security.jgss,java.instrument" > modules.txt

# # JRE Builder stage
# FROM mcr.microsoft.com/openjdk/jdk:21-ubuntu AS jre-builder
# WORKDIR /jre
# COPY --from=analyzer /analyzer/modules.txt .
# RUN modules=$(cat modules.txt) && \
#     jlink --output /opt/custom-jre \
#     --add-modules ${modules} \
#     --strip-debug \
#     --no-man-pages \
#     --no-header-files \
#     --compress=2

# # Run stage
# FROM ubuntu:22.04
# WORKDIR /app
# COPY --from=jre-builder /opt/custom-jre /opt/custom-jre
# ENV JAVA_HOME=/opt/custom-jre
# ENV PATH="$JAVA_HOME/bin:${PATH}"
# COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar
# EXPOSE 9090
# ENTRYPOINT ["sh", "-c", "java --list-modules && java -jar app.jar"]
# ===================================================================================