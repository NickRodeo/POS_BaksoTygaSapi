package com.example.demo;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired private MenuRepository menuRepo;
    @Autowired private UserRepository userRepo;

    private static final String UPLOAD_DIR = "src/main/resources/static/img/";

    private String getAdminName(Principal p) {
        return userRepo.findByUsername(p.getName()).map(User::getNamaLengkap).orElse("Owner");
    }

    // --- MENU SECTION ---
    @GetMapping("/menu")
    public String kelolaMenu(Model model, Principal p) {
        model.addAttribute("adminName", getAdminName(p));
        model.addAttribute("menus", menuRepo.findAll());
        return "admin/menu_management";
    }

    // 1. FORM TAMBAH
    @GetMapping("/menu/tambah")
    public String tampilkanFormTambah(Model model, Principal p) {
        model.addAttribute("adminName", getAdminName(p));
        model.addAttribute("menu", new Menu());
        return "admin/tambahMenu"; // Pastikan file ada di sini
    }

    @PostMapping("/menu/tambah")
    public String tambahMenu(@ModelAttribute Menu menu, 
                             @RequestParam("gambarFile") MultipartFile gambarFile) {
        // Logika upload...
        if (!gambarFile.isEmpty()) {
            try {
                String namaGambar = gambarFile.getOriginalFilename();
                Files.write(Paths.get(UPLOAD_DIR + namaGambar), gambarFile.getBytes());
                menu.setGambar(namaGambar);
            } catch (IOException e) { e.printStackTrace(); }
        }
        menuRepo.save(menu);
        return "redirect:/admin/menu";
    }

    // 2. FORM EDIT
    @GetMapping("/menu/edit/{id}")
    public String tampilkanFormEdit(@PathVariable Long id, Model model, Principal p) {
        Menu menu = menuRepo.findById(id).orElseThrow();
        model.addAttribute("adminName", getAdminName(p));
        model.addAttribute("menu", menu);
        return "admin/editMenu";
    }

    @PostMapping("/menu/edit/{id}")
    public String editMenu(@PathVariable Long id, 
                           @ModelAttribute Menu menuData,
                           @RequestParam("gambarFile") MultipartFile gambarFile) {
        Menu menuExist = menuRepo.findById(id).orElseThrow();
        menuExist.setNama(menuData.getNama());
        menuExist.setHarga(menuData.getHarga());
        menuExist.setStok(menuData.getStok());

        if (!gambarFile.isEmpty()) {
            try {
                String namaGambar = gambarFile.getOriginalFilename();
                Files.write(Paths.get(UPLOAD_DIR + namaGambar), gambarFile.getBytes());
                menuExist.setGambar(namaGambar);
            } catch (IOException e) { e.printStackTrace(); }
        }
        menuRepo.save(menuExist);
        return "redirect:/admin/menu";
    }

    @GetMapping("/menu/hapus/{id}")
    public String hapusMenu(@PathVariable Long id) { menuRepo.deleteById(id); return "redirect:/admin/menu"; }

    // --- USER SECTION ---
    @GetMapping("/user")
    public String kelolaUser(Model model, Principal p) {
        model.addAttribute("adminName", getAdminName(p));
        model.addAttribute("users", userRepo.findAll());
        return "admin/user_management";
    }

    @PostMapping("/user/edit-role/{id}")
    public String editRole(@PathVariable Long id, @RequestParam Role role) {
        User u = userRepo.findById(id).orElseThrow();
        u.setRole(role);
        userRepo.save(u);
        return "redirect:/admin/user";
    }

    @GetMapping("/user/hapus/{id}")
    public String hapusUser(@PathVariable Long id) { userRepo.deleteById(id); return "redirect:/admin/user"; }
}