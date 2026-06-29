package com.blog.backend.repository;

import com.blog.backend.entity.Notification;
import com.blog.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);

    long countByRecipientAndIsReadFalse(User recipient);
    void deleteByPostId(Long postId);

    List<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(
            User recipient);
}