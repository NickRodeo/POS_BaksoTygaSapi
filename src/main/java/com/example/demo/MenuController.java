package com.example.demo;

import com.example.demo.model.Menu;
import com.example.demo.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Controller
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;

    // Folder tempat menyimpan gambar di dalam project lo
    private static final String UPLOAD_DIR = "src/main/resources/static/img/";

    @GetMapping("/")
    public String kasir(Model model) {
        model.addAttribute("daftarMenu", menuRepository.findAll());
        return "index";
    }

    // ==========================================
    // 1. ENDPOINT: TAMBAH MENU (+ UPLOAD GAMBAR)
    // ==========================================
    @PostMapping("/menu/tambah")
    public String tambahMenu(@RequestParam("nama") String nama,
                             @RequestParam("harga") int harga,
                             @RequestParam("stok") int stok,
                             @RequestParam("gambarFile") MultipartFile gambarFile) {
        
        String namaGambar = "default.jpg"; // Fallback kalau gak upload gambar

        if (!gambarFile.isEmpty()) {
            try {
                // Ambil nama file asli yang di-upload (contoh: bakso-mercon.jpg)
                namaGambar = gambarFile.getOriginalFilename();
                
                // Tentukan lokasi absolut penyimpanan folder img
                Path path = Paths.get(UPLOAD_DIR + namaGambar);
                
                // Tulis/simpan file gambar secara fisik ke folder project
                Files.write(path, gambarFile.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
                // Kalau gagal upload, tetep lanjut pake gambar default biar gak crash 500
            }
        }

        // Simpan data objek baru ke SQLite
        Menu menuBaru = new Menu(nama, harga, stok, namaGambar);
        menuRepository.save(menuBaru);

        return "redirect:/"; // Balik ke halaman utama kasir
    }

    // ==========================================
    // 2. ENDPOINT: EDIT MENU (+ OPSIONAL UPLOAD)
    // ==========================================
    @PostMapping("/menu/edit/{id}")
    public String editMenu(@PathVariable("id") Long id,
                           @RequestParam("nama") String nama,
                           @RequestParam("harga") int harga,
                           @RequestParam("stok") int stok,
                           @RequestParam("gambarFile") MultipartFile gambarFile) {

        Optional<Menu> dataMenu = menuRepository.findById(id);
        
        if (dataMenu.isPresent()) {
            Menu menuExist = dataMenu.get();
            menuExist.setNama(nama);
            menuExist.setHarga(harga);
            menuExist.setStok(stok);

            // Jika user mengupload gambar baru saat edit
            if (!gambarFile.isEmpty()) {
                try {
                    String namaGambarBaru = gambarFile.getOriginalFilename();
                    Path path = Paths.get(UPLOAD_DIR + namaGambarBaru);
                    Files.write(path, gambarFile.getBytes());
                    
                    // Ganti nama gambar lama di DB dengan yang baru di-upload
                    menuExist.setGambar(namaGambarBaru);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            // Kalau gambarFile kosong, field gambar di DB gak bakal berubah (pake yang lama)

            menuRepository.save(menuExist);
        }

        return "redirect:/";
    }

    // ==========================================
    // 3. ENDPOINT: HAPUS MENU
    // ==========================================
    @GetMapping("/menu/hapus/{id}")
    public String hapusMenu(@PathVariable("id") Long id) {
        // Disini kita pake GetMapping biar gampang di-trigger lewat tag <a href="..."> di HTML nanti
        menuRepository.deleteById(id);
        return "redirect:/";
    }
}