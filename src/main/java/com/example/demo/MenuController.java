package com.example.demo;

import com.example.demo.model.Menu; // Import class tadi
import com.example.demo.model.Transaksi;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.Arrays;
import java.util.List;

@Controller
public class MenuController {

    @GetMapping("/")
    public String home(Model model) {
        // 1. Cara Pakai: Membuat Objek Menu (Instansiasi)
        Menu m1 = new Menu("Bakso Urat", 15000);
        Menu m2 = new Menu("Bakso Telur", 18000);
        List<Menu> listMenu = Arrays.asList(m1, m2);

        // 2. Membuat Objek Transaksi
        Transaksi trx1 = new Transaksi("TRX-001", listMenu);

        // Kirim ke HTML
        model.addAttribute("daftarMenu", listMenu);
        model.addAttribute("total", trx1.totalHarga);
        
        return "index";
    }
}