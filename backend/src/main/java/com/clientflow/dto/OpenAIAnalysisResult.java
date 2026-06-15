package com.clientflow.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenAIAnalysisResult(
        String summary,
        List<String> keyPoints,
        List<String> actionItems,
        String followUpEmail,
        String sentiment,
        String priority
) {
}
