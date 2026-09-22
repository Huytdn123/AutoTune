package com.virtualtune;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VirtualTuneApplication {

    public static void main(String[] args) {
        SpringApplication.run(VirtualTuneApplication.class, args);
        System.out.println(">>> VIRTUAL TUNE API SERVER IS RUNNING ON http://localhost:8080");
        System.out.println(">>> Swagger UI Documentation: http://localhost:8080/swagger-ui.html");
    }

}
