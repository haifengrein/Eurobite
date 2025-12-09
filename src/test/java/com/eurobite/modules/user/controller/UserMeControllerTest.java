package com.eurobite.modules.user.controller;

import com.eurobite.common.context.BaseContext;
import com.eurobite.common.test.AbstractIntegrationTest;
import com.eurobite.common.util.JwtUtil;
import com.eurobite.modules.user.entity.AddressBook;
import com.eurobite.modules.user.entity.User;
import com.eurobite.modules.user.repository.AddressBookRepository;
import com.eurobite.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc(addFilters = false)
class UserMeControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressBookRepository addressBookRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String token;
    private Long userId;

    @BeforeEach
    void setUp() {
        addressBookRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User();
        user.setPhone("13800000009");
        user.setStatus(1);
        user = userRepository.save(user);
        userId = user.getId();

        AddressBook addr1 = new AddressBook();
        addr1.setUserId(userId);
        addr1.setConsignee("Alice");
        addr1.setPhone("13800000009");
        addr1.setProvinceName("P");
        addr1.setCityName("C");
        addr1.setDistrictName("D");
        addr1.setDetail("Street 1");
        addr1.setIsDefault(true);
        addressBookRepository.save(addr1);

        token = jwtUtil.generateToken(userId, user.getPhone());

        // Set current user context for service layer
        BaseContext.setCurrentId(userId);
    }

    @Test
    void exportMe_ReturnsUserAndAddresses() throws Exception {
        mockMvc.perform(get("/api/user/me/export")
                        .header("Authorization", "Bearer " + token)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.user.id").value(userId))
                .andExpect(jsonPath("$.data.addresses.length()").value(1));
    }

    @Test
    void deleteMe_AnonymizesUserAndDeletesAddresses() throws Exception {
        // Re-set context for this test (可能被 previous test cleared)
        BaseContext.setCurrentId(userId);

        mockMvc.perform(delete("/api/user/me")
                        .header("Authorization", "Bearer " + token)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        User reloaded = userRepository.findById(userId).orElseThrow();
        assertThat(reloaded.getStatus()).isEqualTo(0);
        // phone 保持不变，因为数据库有 NOT NULL 约束
        assertThat(reloaded.getPhone()).isEqualTo("13800000009");
        assertThat(reloaded.getUsername()).isNull();
        assertThat(reloaded.getIdNumber()).isNull();
        assertThat(reloaded.getAvatar()).isNull();

        List<AddressBook> addresses = addressBookRepository.findByUserId(userId);
        assertThat(addresses).isEmpty();
    }
}
