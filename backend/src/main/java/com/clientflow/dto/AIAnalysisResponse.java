package com.clientflow.dto;

import com.clientflow.entity.TaskPriority;

import java.time.Instant;
import java.util.List;

public record AIAnalysisResponse(
        Long id,
        Long meetingNoteId,
        String summary,
        List<String> keyPoints,
        List<String> actionItems,
        String followUpEmail,
        String sentiment,
        TaskPriority priority,
        Instant createdAt
) {
}
