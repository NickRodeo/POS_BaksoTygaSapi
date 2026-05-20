package com.example.demo;

import com.example.demo.model.Menu;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.MenuRepository;
import com.example.demo.repository.UserRepository;

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
    public CommandLineRunner initData(MenuRepository menuRepository, UserRepository userRepository) {
        return args -> {
            // Cek dulu, kalau database masih kosong, isi datanya
            if (menuRepository.count() == 0) {
                menuRepository.save(new Menu("Bakso Iga", 40000, 15, "BaksoIga.jpg"));
                menuRepository.save(new Menu("Bakso Iga Istimewah", 52000, 10, "BaksoIgaIstimewah.jpg"));
                menuRepository.save(new Menu("Es Teh Manis", 5000, 50, "EsTehManis.jpg"));
                System.out.println("====== DATA AWAL BAKSO BERHASIL DITAMBAHKAN ======");
            }
            // User adminLama = userRepository.findByUsername("admin").orElse(null);

            // if (adminLama != null) {
            //     userRepository.delete(adminLama);
            //     System.out.println("====== USER ADMIN BERHASIL DIHAPUS ======");
            // }
            
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setNamaLengkap("Admin");
                admin.setUsername("admin");
                admin.setEmail("admin@admin.com");
                admin.setNoTelp("08123456789");
                admin.setPassword("$2a$10$E22HJ.jp29S6EeqUhOxtx.ecL8zGnf8anIxuZPVnAtsS/bVjK0KPC"); // Password pendek: xxxxxxxx
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("====== USER ADMIN BERHASIL DITAMBAHKAN ======");
            }
            
        };
    }
}