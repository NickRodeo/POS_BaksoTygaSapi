package com.example.demo.model;
import java.util.List;

public class Transaksi {
    public String id;
    public List<Menu> itemPesanan; // Nyambungin ke class Menu
    public double totalHarga;

    public Transaksi(String id, List<Menu> itemPesanan) {
        this.id = id;
        this.itemPesanan = itemPesanan;
        this.totalHarga = hitungTotal();
    }

    private double hitungTotal() {
        return itemPesanan.stream().mapToDouble(m -> m.harga).sum();
    }
}