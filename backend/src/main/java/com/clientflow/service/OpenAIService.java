package com.clientflow.service;

import com.clientflow.dto.OpenAIAnalysisResult;
import com.clientflow.exception.ApiException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    private static final String SYSTEM_PROMPT = """
            You are a business assistant for freelancers and consultants.
            Turn messy meeting notes into clean, actionable business output.
            Respond with valid JSON only, no markdown, using this exact shape:
            {
              "summary": "string",
              "keyPoints": ["string"],
              "actionItems": ["string"],
              "followUpEmail": "string",
              "sentiment": "string",
              "priority": "LOW|MEDIUM|HIGH"
            }
            """;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String model;

    public OpenAIService(
            @Value("${app.openai.api-key}") String apiKey,
            @Value("${app.openai.model}") String model,
            ObjectMapper objectMapper
    ) {
        this.model = model;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    public OpenAIAnalysisResult analyzeMeetingNotes(String rawNotes, String clientName, String companyName) {
        String userPrompt = """
                Client name: %s
                Company: %s

                Meeting notes:
                %s
                """.formatted(clientName, companyName != null ? companyName : "N/A", rawNotes);

        try {
            String responseBody = restClient.post()
                    .uri("/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(buildRequestBody(userPrompt))
                    .retrieve()
                    .body(String.class);

            return parseResult(extractContent(responseBody));
        } catch (RestClientException | JsonProcessingException ex) {
            throw new ApiException(502, "AI processing failed. Please try again.");
        }
    }

    private Map<String, Object> buildRequestBody(String userPrompt) {
        return Map.of(
                "model", model,
                "temperature", 0.3,
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content", SYSTEM_PROMPT),
                        Map.of("role", "user", "content", userPrompt)
                )
        );
    }

    private String extractContent(String responseBody) throws JsonProcessingException {
        JsonNode root = objectMapper.readTree(responseBody);
        return root.path("choices").path(0).path("message").path("content").asText();
    }

    private OpenAIAnalysisResult parseResult(String content) throws JsonProcessingException {
        String cleaned = content.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("^```json\\s*|^```\\s*|```$", "").trim();
        }
        return objectMapper.readValue(cleaned, OpenAIAnalysisResult.class);
    }
}
