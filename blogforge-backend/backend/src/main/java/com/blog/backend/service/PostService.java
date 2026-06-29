package com.blog.backend.service;

import com.blog.backend.dto.request.PostRequest;
import com.blog.backend.dto.response.PostResponse;
import com.blog.backend.entity.Post;
import com.blog.backend.entity.User;
import com.blog.backend.exception.ResourceNotFoundException;
import com.blog.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    public Page<PostResponse> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toResponse);
    }

    public PostResponse getPostById(Long id) {
        Post post = findPost(id);
        return toResponse(post);
    }

    public Page<PostResponse> getPostsByUser(String username, int page, int size) {
        User user = findUser(username);
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByAuthorOrderByCreatedAtDesc(user, pageable)
                .map(this::toResponse);
    }

    public Page<PostResponse> searchPosts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.searchByKeyword(keyword, pageable)
                .map(this::toResponse);
    }

    // Add this new method to PostService.java
    public List<PostResponse> getPostsByUsername(String username) {
        User user = findUser(username);
        return postRepository.findByAuthorOrderByCreatedAtDesc(user, Pageable.unpaged())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostResponse createPost(PostRequest request, String username) {
        User author = findUser(username);
        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .summary(request.getSummary())
                .imageUrl(request.getImageUrl())  // ✅ already added
                .author(author)
                .build();
        return toResponse(postRepository.save(post));
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest request, String username) {
        Post post = findPost(id);
        verifyOwnership(post.getAuthor().getUsername(), username);

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary());
        post.setImageUrl(request.getImageUrl());  // ✅ ADD THIS — was missing!
        return toResponse(postRepository.save(post));
    }

    @Transactional
    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        // ✅ Delete child records first (breaks foreign key constraint)
        postLikeRepository.deleteByPost(post);
        notificationRepository.deleteByPostId(id);

        postRepository.delete(post);
    }

    private Post findPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private void verifyOwnership(String ownerUsername, String currentUsername) {
        if (!ownerUsername.equals(currentUsername)) {
            throw new AccessDeniedException("You are not authorized to modify this resource");
        }
    }

    private PostResponse toResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .summary(post.getSummary())
                .imageUrl(post.getImageUrl())
                .authorId(post.getAuthor().getId())
                .authorUsername(post.getAuthor().getUsername())
                .commentCount(commentRepository.countByPost(post))
                .likeCount(postLikeRepository.countByPost(post))  // ← ADD
                .likedByMe(false)                                  // ← ADD (default)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}