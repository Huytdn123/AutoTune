package com.virtualtune.config;

import com.virtualtune.seeder.BuildAndOrderSeeder;
import com.virtualtune.seeder.CarFleetSeeder;
import com.virtualtune.seeder.PartCatalogSeeder;
import com.virtualtune.seeder.UserAndGarageSeeder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * DataInitializer - Master coordinator for database seeding.
 * Delegates domain-specific initialization to dedicated seeders.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserAndGarageSeeder userAndGarageSeeder;

    @Autowired
    private PartCatalogSeeder partCatalogSeeder;

    @Autowired
    private CarFleetSeeder carFleetSeeder;

    @Autowired
    private BuildAndOrderSeeder buildAndOrderSeeder;

    @Override
    public void run(String... args) throws Exception {
        try {
            userAndGarageSeeder.seed();
            partCatalogSeeder.seed();
            carFleetSeeder.seed();
            userAndGarageSeeder.syncAccounts();
            buildAndOrderSeeder.seed();
        } catch (Exception e) {
            System.err.println(">>> DataInitializer notice: " + e.getMessage());
        }
    }
}
