package com.virtualtune;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * VIRTUAL TUNE - B2B 3D Automotive Customization Platform
 *
 * TÀI KHOẢN TEST TỪNG ROLE (Mật khẩu: password123):
 * - GARAGE_OWNER    : admin_garage / password123
 * - LEAD_TECHNICIAN : tech_lead    / password123
 * - CAR_OWNER       : customer_vip / password123
 */
@SpringBootApplication
public class VirtualTuneApplication {

    public static void main(String[] args) {
        System.setProperty("spring.classformat.ignore", "true");
        SpringApplication.run(VirtualTuneApplication.class, args);
        System.out.println(">>> Virtual Tune API: http://localhost:8080");
        System.out.println(">>> Test Accounts [Pass: password123]: admin_garage | tech_lead | customer_vip");
    }

}
