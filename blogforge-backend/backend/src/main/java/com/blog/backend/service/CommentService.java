package com.blog.backend.service;

import com.blog.backend.dto.request.CommentRequest;
import com.blog.backend.dto.response.CommentResponse;
import com.blog.backend.entity.Comment;
import com.blog.backend.entity.Post;
import com.blog.backend.entity.User;
import com.blog.backend.exception.ResourceNotFoundException;
import com.blog.backend.repository.CommentRepository;
import com.blog.backend.repository.PostRepository;
import com.blog.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository    postRepository;
    private final UserRepository    userRepository;
    private final NotificationService notificationService;

    public List<CommentResponse> getCommentsByPost(Long postId) {
        Post post = findPost(postId);
        return commentRepository
                .findByPostAndParentIsNullOrderByCreatedAtDesc(post)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse addComment(Long postId, CommentRequest request,
                                      String username) {
        Post post   = findPost(postId);
        User author = findUser(username);

        Comment parent = null;
        if (request.getParentId() != null) {
            parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .post(post)
                .author(author)
                .parent(parent)
                .build();

        Comment saved = commentRepository.save(comment);

        // ✅ Send notification
        if (parent == null) {
            // New comment on post
            notificationService.notifyComment(
                    post.getAuthor(), author,
                    postId, saved.getId(), post.getTitle()
            );
        } else {
            // Reply to comment
            notificationService.notifyReply(
                    parent.getAuthor(), author,
                    postId, saved.getId()
            );
        }

        return toResponse(saved);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, CommentRequest request,
                                         String username) {
        Comment comment = findComment(commentId);
        verifyOwnership(comment.getAuthor().getUsername(), username);
        comment.setContent(request.getContent());
        return toResponse(commentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(Long commentId, String username) {
        Comment comment = findComment(commentId);
        verifyOwnership(comment.getAuthor().getUsername(), username);
        commentRepository.delete(comment);
    }

    private Post findPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Post not found with id: " + id));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found: " + username));
    }

    private Comment findComment(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comment not found with id: " + id));
    }

    private void verifyOwnership(String ownerUsername, String currentUsername) {
        if (!ownerUsername.equals(currentUsername)) {
            throw new AccessDeniedException(
                    "You are not authorized to modify this resource");
        }
    }

    private CommentResponse toResponse(Comment comment) {
        // Map replies recursively
        List<CommentResponse> replies = comment.getReplies() == null
                ? List.of()
                : comment.getReplies().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .postId(comment.getPost().getId())
                .authorId(comment.getAuthor().getId())
                .authorUsername(comment.getAuthor().getUsername())
                .parentId(comment.getParent() != null
                        ? comment.getParent().getId() : null)
                .replies(replies)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}