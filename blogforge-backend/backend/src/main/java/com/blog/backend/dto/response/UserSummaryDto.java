package com.blog.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSummaryDto {
    private String username;
    private long postCount;
}