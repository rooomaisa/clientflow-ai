package com.clientflow.dto;

import com.clientflow.entity.ClientStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ClientRequest(
        @NotBlank(message = "Client name is required")
        String name,

        String companyName,

        @Email(message = "Client email must be valid")
        String email,

        String phone,
        String notes,
        ClientStatus status
) {
}
