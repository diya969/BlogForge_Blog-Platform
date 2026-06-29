package com.blog.backend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String summary;
    private Long authorId;
    private String authorUsername;
    private long commentCount;
    private long likeCount;      // ← ADD
    private boolean likedByMe;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String imageUrl;   // ← add this field
}