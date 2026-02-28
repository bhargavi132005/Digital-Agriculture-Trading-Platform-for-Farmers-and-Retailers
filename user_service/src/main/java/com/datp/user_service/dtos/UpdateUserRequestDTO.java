package com.datp.user_service.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRequestDTO {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String role;
}
