package com.example.demo;

import com.example.demo.model.Menu;
import com.example.demo.repository.MenuRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(MenuRepository menuRepository) {
        return args -> {
            // Cek dulu, kalau database masih kosong, isi datanya
            if (menuRepository.count() == 0) {
                menuRepository.save(new Menu("Bakso Iga", 40000, 15, "BaksoIga.jpg"));
                menuRepository.save(new Menu("Bakso Iga Istimewah", 52000, 10, "BaksoIgaIstimewah.jpg"));
                menuRepository.save(new Menu("Es Teh Manis", 5000, 50, "EsTehManis.jpg"));
                System.out.println("====== DATA AWAL BAKSO BERHASIL DITAMBAHKAN ======");
            }
        };
    }
}