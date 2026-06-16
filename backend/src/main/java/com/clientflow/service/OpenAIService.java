package com.clientflow.service;

import com.clientflow.dto.OpenAIAnalysisResult;
import com.clientflow.exception.ApiException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    private static final Logger log = LoggerFactory.getLogger(OpenAIService.class);

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
    private final String apiKey;

    public OpenAIService(
            @Value("${app.openai.api-key}") String apiKey,
            @Value("${app.openai.model}") String model,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.model = model;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + this.apiKey)
                .build();
    }

    public boolean isConfigured() {
        return !apiKey.isBlank() && !apiKey.startsWith("sk-your");
    }

    public OpenAIAnalysisResult analyzeMeetingNotes(String rawNotes, String clientName, String companyName) {
        if (!isConfigured()) {
            throw new ApiException(
                    503,
                    "OpenAI API key is not configured. Add OPENAI_API_KEY to backend/.env and restart the backend."
            );
        }
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
                    .onStatus(HttpStatusCode::isError, (request, response) -> {
                        String body = response.getBody() != null
                                ? new String(response.getBody().readAllBytes(), StandardCharsets.UTF_8)
                                : "";
                        log.error("OpenAI API error {}: {}", response.getStatusCode(), body);
                        throw mapOpenAiError(response.getStatusCode().value());
                    })
                    .body(String.class);

            return parseResult(extractContent(responseBody));
        } catch (ApiException ex) {
            throw ex;
        } catch (RestClientException | JsonProcessingException ex) {
            log.error("AI processing failed", ex);
            throw new ApiException(502, "AI processing failed. Please try again.");
        }
    }

    private ApiException mapOpenAiError(int status) {
        return switch (status) {
            case 401 -> new ApiException(
                    502,
                    "OpenAI API key is invalid. Check OPENAI_API_KEY in backend/.env and restart the backend."
            );
            case 403 -> new ApiException(
                    502,
                    "OpenAI access denied. Confirm billing is enabled and the key has API access."
            );
            case 429 -> new ApiException(
                    502,
                    "OpenAI quota or rate limit exceeded. Check usage and billing at platform.openai.com."
            );
            default -> new ApiException(502, "AI processing failed. Please try again.");
        };
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
