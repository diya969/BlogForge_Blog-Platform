package com.blog.backend.repository;

import com.blog.backend.entity.Post;
import com.blog.backend.entity.PostLike;
import com.blog.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByPostAndUser(Post post, User user);
    long countByPost(Post post);
    void deleteByPostAndUser(Post post, User user);
    void deleteByPost(Post post);
}