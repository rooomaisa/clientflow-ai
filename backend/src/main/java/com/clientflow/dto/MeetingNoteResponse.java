package com.clientflow.dto;

import java.time.Instant;
import java.time.LocalDate;

public record MeetingNoteResponse(
        Long id,
        Long clientId,
        String title,
        String rawNotes,
        LocalDate meetingDate,
        Instant createdAt,
        Instant updatedAt,
        AIAnalysisResponse aiAnalysis
) {
}
