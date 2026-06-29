package com.blog.backend.repository;

import com.blog.backend.entity.Comment;
import com.blog.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Only top-level comments (no parent)
    List<Comment> findByPostAndParentIsNullOrderByCreatedAtDesc(Post post);

    long countByPost(Post post);
}