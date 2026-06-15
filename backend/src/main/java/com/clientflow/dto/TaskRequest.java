package com.clientflow.dto;

import com.clientflow.entity.TaskPriority;
import com.clientflow.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record TaskRequest(
        @NotBlank(message = "Task title is required")
        String title,

        String description,
        TaskStatus status,
        TaskPriority priority,
        LocalDate dueDate,
        Long clientId,
        Long meetingNoteId
) {
}
