package com.blog.backend.service;

import com.blog.backend.dto.response.NotificationDto;
import com.blog.backend.entity.Notification;
import com.blog.backend.entity.User;
import com.blog.backend.repository.NotificationRepository;
import com.blog.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository         userRepository;

    // Called when someone comments on a post
    @Transactional
    public void notifyComment(User postAuthor, User commenter,
                              Long postId, Long commentId, String postTitle) {
        if (postAuthor.getId().equals(commenter.getId())) return; // don't notify yourself

        Notification notification = Notification.builder()
                .recipient(postAuthor)
                .actor(commenter)
                .type("COMMENT")
                .message(commenter.getUsername() + " commented on your post \"" + postTitle + "\"")
                .postId(postId)
                .commentId(commentId)
                .build();

        notificationRepository.save(notification);
    }

    // Called when someone replies to a comment
    @Transactional
    public void notifyReply(User commentAuthor, User replier,
                            Long postId, Long commentId) {
        if (commentAuthor.getId().equals(replier.getId())) return;

        Notification notification = Notification.builder()
                .recipient(commentAuthor)
                .actor(replier)
                .type("REPLY")
                .message(replier.getUsername() + " replied to your comment")
                .postId(postId)
                .commentId(commentId)
                .build();

        notificationRepository.save(notification);
    }

    // Called when someone likes a post
    @Transactional
    public void notifyLike(User postAuthor, User liker,
                           Long postId, String postTitle) {
        if (postAuthor.getId().equals(liker.getId())) return;

        Notification notification = Notification.builder()
                .recipient(postAuthor)
                .actor(liker)
                .type("LIKE")
                .message(liker.getUsername() + " liked your post \"" + postTitle + "\"")
                .postId(postId)
                .build();

        notificationRepository.save(notification);
    }

    public List<NotificationDto> getNotifications(String username) {
        User user = findUser(username);
        return notificationRepository
                .findByRecipientOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String username) {
        User user = findUser(username);
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    @Transactional
    public void markAllRead(String username) {
        User user = findUser(username);
        List<Notification> unread = notificationRepository
                .findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void markOneRead(Long notificationId) {
        notificationRepository.findById(notificationId)
                .ifPresent(n -> {
                    n.setRead(true);
                    notificationRepository.save(n);
                });
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .actorUsername(n.getActor().getUsername())
                .actorPhoto(n.getActor().getProfilePhoto())
                .type(n.getType())
                .message(n.getMessage())
                .postId(n.getPostId())
                .commentId(n.getCommentId())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}