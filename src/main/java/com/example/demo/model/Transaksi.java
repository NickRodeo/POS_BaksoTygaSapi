package com.example.demo.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transaksi")
public class Transaksi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "no_trx", unique = true, nullable = false)
    private String noTrx;

    @Column(nullable = false)
    private LocalDateTime tanggal;

    @Column(nullable = false)
    private String namaKasir;

    @Column(nullable = false)
    private Double subtotal;

    @Column(nullable = false)
    private Double totalBayar;

    @Column(nullable = false)
    private Double tunai;

    @Column(nullable = false)
    private Double kembali;

    @OneToMany(mappedBy = "transaksi", cascade = CascadeType.ALL, orphanRemoval = true,  fetch = FetchType.EAGER)
    private List<TransaksiDetail> details = new ArrayList<>();

    // Helper method untuk menambahkan detail transaksi
    public void addDetail(TransaksiDetail detail) {
        details.add(detail);
        detail.setTransaksi(this);
    }

    // --- Getter dan Setter ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNoTrx() { return noTrx; }
    public void setNoTrx(String noTrx) { this.noTrx = noTrx; }
    public LocalDateTime getTanggal() { return tanggal; }
    public void setTanggal(LocalDateTime tanggal) { this.tanggal = tanggal; }
    public String getNamaKasir() { return namaKasir; }
    public void setNamaKasir(String namaKasir) { this.namaKasir = namaKasir; }
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    public Double getTotalBayar() { return totalBayar; }
    public void setTotalBayar(Double totalBayar) { this.totalBayar = totalBayar; }
    public Double getTunai() { return tunai; }
    public void setTunai(Double tunai) { this.tunai = tunai; }
    public Double getKembali() { return kembali; }
    public void setKembali(Double kembali) { this.kembali = kembali; }
    public List<TransaksiDetail> getDetails() { return details; }
    public void setDetails(List<TransaksiDetail> details) { this.details = details; }
}