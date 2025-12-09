package com.eurobite.common.file;

import com.eurobite.common.exception.CustomException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    @Value("${eurobite.path}")
    private String basePath;

    @Override
    public String upload(MultipartFile file) throws IOException {
        // Check if base path exists
        File dir = new File(basePath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Original filename
        String originalFilename = file.getOriginalFilename();
        String suffix = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        
        // Generate random filename
        String fileName = UUID.randomUUID().toString() + suffix;

        // Save
        file.transferTo(new File(basePath + fileName));

        return fileName;
    }
}
