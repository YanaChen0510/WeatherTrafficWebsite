package com.group05;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class AppTest {

    @Test
    void testHelloMessage() {
        String message = "Hello, Weather Traffic Backend is running successfully!";
        assertEquals("Hello, Weather Traffic Backend is running successfully!", message);
    }
}
