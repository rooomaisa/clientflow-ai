package com.clientflow.controller;

import com.clientflow.service.OpenAIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    private final DataSource dataSource;
    private final OpenAIService openAIService;

    public HealthController(DataSource dataSource, OpenAIService openAIService) {
        this.dataSource = dataSource;
        this.openAIService = openAIService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new LinkedHashMap<>();
        response.put("status", "ok");
        response.put("database", checkDatabase(response));
        response.put("openai", openAIService.isConfigured() ? "configured" : "missing");
        return response;
    }

    private String checkDatabase(Map<String, String> response) {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(2) ? "connected" : "disconnected";
        } catch (Exception ex) {
            log.warn("Database health check failed: {}", ex.getMessage());
            response.put("databaseError", ex.getMessage());
            return "disconnected";
        }
    }
}
