package com.cscreativ.billboard;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.modulith.docs.Documenter;

/**
 * Verifies that the shared/user/billboard/booking/payment/proofofperformance
 * modules only talk to each other through their public facades and events,
 * and generates the module diagrams under target/spring-modulith-docs.
 */
class ModularityTests {

    static final ApplicationModules MODULES = ApplicationModules.of(BillboardApplication.class);

    @Test
    void verifiesModularStructure() {
        MODULES.verify();
    }

    @Test
    void writesDocumentation() {
        new Documenter(MODULES)
                .writeDocumentation()
                .writeIndividualModulesAsPlantUml();
    }
}
