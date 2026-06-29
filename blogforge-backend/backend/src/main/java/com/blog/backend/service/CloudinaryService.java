package com.blog.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "blogforge/posts",
                        "resource_type", "image"
                )
        );
        return result.get("secure_url").toString();
    }

    public void deleteImage(String imageUrl) {
        try {
            // Extract public_id from URL
            String publicId = imageUrl
                    .substring(imageUrl.indexOf("blogforge/posts"))
                    .replace(".jpg", "")
                    .replace(".png", "")
                    .replace(".jpeg", "")
                    .replace(".webp", "");
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            System.out.println("Could not delete image: " + e.getMessage());
        }
    }
}