package com.blog.backend.dto.request;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String currentPassword;
    private String newPassword;
    private String profilePhoto;
}