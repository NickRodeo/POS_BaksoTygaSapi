package com.example.demo;

import com.example.demo.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@Controller
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;

    @GetMapping("/")
    public String kasir(Model model) {
        model.addAttribute("daftarMenu", menuRepository.findAll());
        return "index";
    }

    
}