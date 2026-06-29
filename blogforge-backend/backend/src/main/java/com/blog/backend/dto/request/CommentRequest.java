package com.blog.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequest {

    @NotBlank(message = "Content is required")
    private String content;

    private Long parentId;   // ✅ ADD — null for top-level, id for reply
}