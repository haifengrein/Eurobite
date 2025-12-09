package com.eurobite.common.controller;

import com.eurobite.common.file.FileStorageService;
import com.eurobite.common.model.R;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/common")
@RequiredArgsConstructor
@Tag(name = "Common", description = "File Upload/Download")
public class CommonController {

    private final FileStorageService fileStorageService;

    @Value("${eurobite.path}")
    private String basePath;

    @PostMapping("/upload")
    @Operation(summary = "Upload File")
    public R<String> upload(MultipartFile file) {
        try {
            String fileName = fileStorageService.upload(file);
            return R.success(fileName);
        } catch (IOException e) {
            e.printStackTrace();
            return R.error("File upload failed");
        }
    }

    @GetMapping("/download")
    @Operation(summary = "Download File")
    public void download(String name, HttpServletResponse response) {
        try {
            // Input stream
            File file = new File(basePath + name);
            if (!file.exists()) {
                return; // Or 404
            }
            FileInputStream fileInputStream = new FileInputStream(file);

            // Output stream
            ServletOutputStream outputStream = response.getOutputStream();

            response.setContentType("image/jpeg");

            int len = 0;
            byte[] bytes = new byte[1024];
            while ((len = fileInputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, len);
            }
            outputStream.flush();
            outputStream.close();
            fileInputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
