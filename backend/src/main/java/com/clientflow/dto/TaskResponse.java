package com.clientflow.dto;

import com.clientflow.entity.TaskPriority;
import com.clientflow.entity.TaskStatus;

import java.time.Instant;
import java.time.LocalDate;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        LocalDate dueDate,
        Long clientId,
        Long meetingNoteId,
        Instant createdAt,
        Instant updatedAt
) {
}
