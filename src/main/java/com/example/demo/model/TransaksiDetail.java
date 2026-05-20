package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "transaksi_detail")
public class TransaksiDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaksi_id", nullable = false)
    private Transaksi transaksi;

    @Column(nullable = false)
    private String namaMenu;

    @Column(nullable = false)
    private Integer qty;

    @Column(nullable = false)
    private Double hargaSatuan;

    @Column(nullable = false)
    private Double subtotalItem;

    // --- Getter dan Setter ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Transaksi getTransaksi() { return transaksi; }
    public void setTransaksi(Transaksi transaksi) { this.transaksi = transaksi; }
    public String getNamaMenu() { return namaMenu; }
    public void setNamaMenu(String namaMenu) { this.namaMenu = namaMenu; }
    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
    public Double getHargaSatuan() { return hargaSatuan; }
    public void setHargaSatuan(Double hargaSatuan) { this.hargaSatuan = hargaSatuan; }
    public Double getSubtotalItem() { return subtotalItem; }
    public void setSubtotalItem(Double subtotalItem) { this.subtotalItem = subtotalItem; }
}
