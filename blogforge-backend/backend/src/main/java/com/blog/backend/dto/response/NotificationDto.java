package com.blog.backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long   id;
    private String actorUsername;
    private String actorPhoto;
    private String type;
    private String message;
    private Long   postId;
    private Long   commentId;
    private boolean isRead;
    private LocalDateTime createdAt;
}