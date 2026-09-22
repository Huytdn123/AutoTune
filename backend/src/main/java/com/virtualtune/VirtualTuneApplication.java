package com.virtualtune;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class VirtualTuneApplication {

    public static void main(String[] args) {
        System.setProperty("spring.classformat.ignore", "true");
        SpringApplication.run(VirtualTuneApplication.class, args);
        System.out.println(">>> VIRTUAL TUNE API SERVER IS RUNNING ON http://localhost:8080");
    }

}
