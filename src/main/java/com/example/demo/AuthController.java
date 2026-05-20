package com.example.demo;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.validation.Valid;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/login")
    public String showLoginForm(@RequestParam(value = "error", required = false) String error,
                                @RequestParam(value = "logout", required = false) String logout,
                                Model model) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Jika auth tidak null, terautentikasi, dan BUKAN anonymous user
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            return "redirect:/"; // Lempar ke halaman utama kasir jika nekat buka /login
        }
        if (error != null) model.addAttribute("loginError", "Email/Username atau password salah.");
        if (logout != null) model.addAttribute("successMessage", "Anda berhasil logout.");
        return "login";
    }

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            return "redirect:/";
        }
        model.addAttribute("formData", new RegisterRequest());
        return "register";
    }

    @PostMapping("/register")
    public String processRegister(@Valid @ModelAttribute("formData") RegisterRequest request,
                                  BindingResult bindingResult,
                                  Model model) {
        // 1. JIKA VALIDASI BEAN/ANNOTATION (@NotBlank, @Email, dll) GAGAL
        if (bindingResult.hasErrors()) {
            model.addAttribute("registerError", bindingResult.getFieldError().getDefaultMessage());
            // WAJIB: Masukkan kembali data inputan ke model supaya Thymeleaf th:field tidak null/error
            model.addAttribute("formData", request); 
            return "register";
        }
        
        // 2. VALIDASI MATCH PASSWORD
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            model.addAttribute("registerError", "Konfirmasi password tidak cocok.");
            model.addAttribute("formData", request); 
            return "register";
        }
        
        // 3. VALIDASI USERNAME DUPLIKAT
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            model.addAttribute("registerError", "Username sudah digunakan.");
            model.addAttribute("formData", request); 
            return "register";
        }
        
        // 4. VALIDASI EMAIL DUPLIKAT
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            model.addAttribute("registerError", "Email sudah terdaftar.");
            model.addAttribute("formData", request); 
            return "register";
        }

        // ====== JIKA SEMUA VALIDASI LOLOS, SIMPAN USER ======
        try {
            User newUser = new User();
            newUser.setNamaLengkap(request.getNamaLengkap());
            newUser.setUsername(request.getUsername());
            newUser.setEmail(request.getEmail());
            newUser.setNoTelp(request.getNoTelp());
            
            // Ambil role dari request, jika di model User lo ada field role.
            // Jika belum ada, pastikan string role ini di-handle atau sementara di-ignore.
            // newUser.setRole(request.getRole()); 
            
            newUser.setPassword(passwordEncoder.encode(request.getPassword()));

            userRepository.save(newUser);

            // Kirim pesan sukses ke halaman login
            model.addAttribute("successMessage", "Akun berhasil dibuat. Silakan login.");
            return "login";
            
        } catch (Exception e) {
            model.addAttribute("registerError", "Terjadi kesalahan sistem: " + e.getMessage());
            model.addAttribute("formData", request);
            return "register";
        }
    }
}