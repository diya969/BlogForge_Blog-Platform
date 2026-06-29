package com.blog.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private Long   id;
    private String username;
    private String email;
    private String profilePhoto;
    private String role;
}