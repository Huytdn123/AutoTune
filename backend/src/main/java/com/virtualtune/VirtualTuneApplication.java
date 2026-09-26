package com.virtualtune;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VirtualTuneApplication {

    public static void main(String[] args) {
        System.setProperty("spring.classformat.ignore", "true");
        SpringApplication.run(VirtualTuneApplication.class, args);
        System.out.println(">>> Virtual Tune API: http://localhost:8080");
        System.out.println(">>> Test Accounts [Pass: password123]: admin_garage | tech_lead | customer_vip");
    }

}
