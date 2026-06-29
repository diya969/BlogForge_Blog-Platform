package com.blog.backend.controller;

import com.blog.backend.dto.request.ProfileUpdateRequest;
import com.blog.backend.dto.response.ProfileResponse;
import com.blog.backend.dto.response.UserSummaryDto;
import com.blog.backend.service.CloudinaryService;
import com.blog.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService    profileService;
    private final CloudinaryService cloudinaryService;

    @GetMapping("/api/profile")
    public ResponseEntity<ProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                profileService.getProfile(userDetails.getUsername()));
    }

    @GetMapping("/api/profile/{username}")
    public ResponseEntity<ProfileResponse> getPublicProfile(
            @PathVariable String username) {
        return ResponseEntity.ok(profileService.getProfile(username));
    }

    @PutMapping("/api/profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                profileService.updateProfile(userDetails.getUsername(), request));
    }

    @PostMapping("/api/profile/photo")
    public ResponseEntity<Map<String, String>> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        String imageUrl = cloudinaryService.uploadImage(file);
        ProfileUpdateRequest req = new ProfileUpdateRequest();
        req.setProfilePhoto(imageUrl);
        profileService.updateProfile(userDetails.getUsername(), req);

        return ResponseEntity.ok(Map.of("profilePhoto", imageUrl));
    }

    // ✅ New — user search
    @GetMapping("/api/users/search")
    public ResponseEntity<List<UserSummaryDto>> searchUsers(
            @RequestParam String keyword) {
        return ResponseEntity.ok(profileService.searchUsers(keyword));
    }
}