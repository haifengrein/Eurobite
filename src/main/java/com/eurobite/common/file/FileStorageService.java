package com.eurobite.common.file;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface FileStorageService {
    String upload(MultipartFile file) throws IOException;
    // Download logic usually handled by Controller directly serving resource,
    // or returning a byte array / Resource object.
    // void delete(String fileUrl); // Implement later if needed
}
