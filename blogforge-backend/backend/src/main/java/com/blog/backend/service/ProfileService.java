package com.blog.backend.service;

import com.blog.backend.dto.request.ProfileUpdateRequest;
import com.blog.backend.dto.response.ProfileResponse;
import com.blog.backend.dto.response.UserSummaryDto;
import com.blog.backend.entity.User;
import com.blog.backend.exception.ResourceNotFoundException;
import com.blog.backend.repository.PostRepository;
import com.blog.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PostRepository postRepository;

    public ProfileResponse getProfile(String username) {
        User user = findUser(username);
        return toResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(String username,
                                         ProfileUpdateRequest request) {
        User user = findUser(username);

        if (request.getNewPassword() != null
                && !request.getNewPassword().isBlank()) {

            if (request.getCurrentPassword() == null
                    || !passwordEncoder.matches(
                    request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }

            if (request.getNewPassword().length() < 6) {
                throw new IllegalArgumentException(
                        "New password must be at least 6 characters");
            }

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        if (request.getProfilePhoto() != null
                && !request.getProfilePhoto().isBlank()) {
            user.setProfilePhoto(request.getProfilePhoto());
        }

        return toResponse(userRepository.save(user));
    }

    // ✅ New — user search
    public List<UserSummaryDto> searchUsers(String keyword) {
        return userRepository.searchByUsername(keyword)
                .stream()
                .map(u -> UserSummaryDto.builder()
                        .username(u.getUsername())
                        .postCount(postRepository.countByAuthor(u))
                        .build())
                .collect(Collectors.toList());
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found: " + username));
    }

    private ProfileResponse toResponse(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .profilePhoto(user.getProfilePhoto())
                .role(user.getRole())
                .build();
    }
}