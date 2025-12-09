package com.eurobite.common.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RTest {

    @Test
    void testSuccess() {
        String data = "test data";
        R<String> r = R.success(data);

        assertEquals(0, r.getCode()); // Contract says 0 is success
        assertEquals("success", r.getMsg());
        assertEquals(data, r.getData());
    }

    @Test
    void testError() {
        String msg = "Something went wrong";
        R<String> r = R.error(msg);

        assertEquals(1, r.getCode()); // Default error code
        assertEquals(msg, r.getMsg());
        assertNull(r.getData());
    }

    @Test
    void testErrorWithCode() {
        R<String> r = R.error(404, "Not Found");
        assertEquals(404, r.getCode());
        assertEquals("Not Found", r.getMsg());
    }

    @Test
    void testAddExtraData() {
        R<String> r = R.success("base").add("k1", "v1").add("k2", 123);
        assertEquals("base", r.getData());
        assertEquals(0, r.getCode());
        assertEquals("v1", r.getMap().get("k1"));
        assertEquals(123, r.getMap().get("k2"));
    }
}
