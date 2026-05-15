package com.example.demo.repository;

import com.example.demo.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    // Di sini lo otomatis dapet fungsi save(), findAll(), deleteById(), dll. tanpa ngetik kode sama sekali!
}