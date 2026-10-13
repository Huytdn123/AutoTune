package com.virtualtune;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VirtualTuneApplication {

    public static void main(String[] args) {
        System.setProperty("spring.classformat.ignore", "true");
        SpringApplication.run(VirtualTuneApplication.class, args);
        String activePort = System.getProperty("server.port", System.getenv().getOrDefault("SERVER_PORT", "8080"));
        System.out.println(">>> Virtual Tune API: http://localhost:" + activePort);
        System.out.println(">>> Test Accounts [Pass: password123]: admin_garage | tech_lead | customer_vip");
    }

}
