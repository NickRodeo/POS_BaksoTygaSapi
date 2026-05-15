package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Menu {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    private String nama;
    private double harga;
    private int stok;     
    private String gambar;  

    public Menu() {}

    public Menu(String nama, double harga, int stok, String gambar) {
        this.nama = nama;
        this.harga = harga;
        this.stok = stok;
        this.gambar = gambar;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
    
    public double getHarga() { return harga; }
    public void setHarga(double harga) { this.harga = harga; }

    public int getStok() { return stok; }
    public void setStok(int stok) { this.stok = stok; }
    
    public String getGambar() { return gambar; } 
    public void setGambar(String gambar) { this.gambar = gambar; } 
}