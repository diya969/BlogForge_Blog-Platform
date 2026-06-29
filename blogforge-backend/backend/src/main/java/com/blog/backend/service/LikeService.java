package com.blog.backend.service;

import com.blog.backend.entity.Post;
import com.blog.backend.entity.PostLike;
import com.blog.backend.entity.User;
import com.blog.backend.exception.ResourceNotFoundException;
import com.blog.backend.repository.PostLikeRepository;
import com.blog.backend.repository.PostRepository;
import com.blog.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public Map<String, Object> toggleLike(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean alreadyLiked = postLikeRepository.existsByPostAndUser(post, user);

        if (alreadyLiked) {
            postLikeRepository.deleteByPostAndUser(post, user);
        } else {
            PostLike like = PostLike.builder()
                    .post(post).user(user).build();
            postLikeRepository.save(like);

            // ✅ Notify post author
            notificationService.notifyLike(
                    post.getAuthor(), user, postId, post.getTitle()
            );
        }

        long likeCount = postLikeRepository.countByPost(post);
        return Map.of("liked", !alreadyLiked, "likeCount", likeCount);
    }

    public Map<String, Object> getLikeInfo(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        long likeCount = postLikeRepository.countByPost(post);
        boolean liked = false;

        if (username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                liked = postLikeRepository.existsByPostAndUser(post, user);
            }
        }

        return Map.of("liked", liked, "likeCount", likeCount);
    }
}