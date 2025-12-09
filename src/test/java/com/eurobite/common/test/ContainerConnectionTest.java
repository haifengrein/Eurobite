package com.eurobite.common.test;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ContainerConnectionTest extends AbstractIntegrationTest {

    @Test
    void verifyContainersRunning() {
        assertTrue(postgres.isRunning());
        assertTrue(redis.isRunning());
    }
}
