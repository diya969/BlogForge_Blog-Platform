package com.blog.backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private Long postId;
    private Long authorId;
    private String authorUsername;
    private Long parentId;                    // ✅ ADD
    private List<CommentResponse> replies;    // ✅ ADD
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}