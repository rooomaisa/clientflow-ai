package com.clientflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record MeetingNoteRequest(
        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Meeting notes are required")
        String rawNotes,

        @NotNull(message = "Meeting date is required")
        LocalDate meetingDate
) {
}
