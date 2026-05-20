package com.example.demo.dto;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Nama lengkap wajib diisi")
    private String namaLengkap;

    @NotBlank(message = "Username wajib diisi")
    @Size(min = 4, message = "Username minimal 4 karakter")
    private String username;

    @NotBlank(message = "Email wajib diisi")
    @Email(message = "Format email tidak valid")
    private String email;

    @NotBlank(message = "Nomor telepon wajib diisi")
    private String noTelp;

    @NotBlank(message = "Password wajib diisi")
    @Size(min = 8, message = "Password minimal 8 karakter")
    private String password;
    
    private String confirmPassword;
}
