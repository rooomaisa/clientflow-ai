package com.clientflow.dto;

import com.clientflow.entity.ClientStatus;

import java.time.Instant;

public record ClientResponse(
        Long id,
        String name,
        String companyName,
        String email,
        String phone,
        String notes,
        ClientStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
