package com.eurobite.common.exception;

import com.eurobite.common.model.R;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = GlobalExceptionHandlerTest.TestController.class)
@Import({GlobalExceptionHandler.class}) // We need to import the handler to test it
@AutoConfigureMockMvc(addFilters = false) // Disable Spring Security filters for this test
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testCustomException() throws Exception {
        mockMvc.perform(get("/test/custom"))
                .andExpect(status().isOk()) // We return 200 OK even for errors, with code != 0
                .andExpect(jsonPath("$.code").value(1))
                .andExpect(jsonPath("$.msg").value("Business Error"));
    }

    @Test
    void testUnknownException() throws Exception {
        mockMvc.perform(get("/test/unknown"))
                .andExpect(status().isOk()) // Or 500 depending on design. EuroBite contract says R object returned.
                .andExpect(jsonPath("$.code").value(1))
                .andExpect(jsonPath("$.msg").value("Unknown Error"));
    }

    @Test
    void testSqlIntegrityViolationTranslated() throws Exception {
        mockMvc.perform(get("/test/sql-violation"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1))
                .andExpect(jsonPath("$.msg").exists());
    }

    @Configuration
    static class Config {
        @Bean
        public TestController testController() {
            return new TestController();
        }
    }

    @RestController
    static class TestController {
        @GetMapping("/test/custom")
        public R<String> throwCustom() {
            throw new CustomException("Business Error");
        }

        @GetMapping("/test/unknown")
        public R<String> throwUnknown() {
            throw new RuntimeException("Unknown Error");
        }

        @GetMapping("/test/sql-violation")
        public R<String> throwSqlViolation() throws java.sql.SQLIntegrityConstraintViolationException {
            throw new java.sql.SQLIntegrityConstraintViolationException("Duplicate entry 'admin' for key 'uk_username'");
        }
    }
}
