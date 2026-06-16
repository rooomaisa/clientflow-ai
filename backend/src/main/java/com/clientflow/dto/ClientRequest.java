package com.clientflow.dto;

import com.clientflow.entity.ClientStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ClientRequest(
        @NotBlank(message = "Client name is required")
        String name,

        String companyName,

        @Pattern(
                regexp = "^$|^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
                message = "Client email must be valid"
        )
        String email,

        String phone,
        String notes,
        ClientStatus status
) {
}
