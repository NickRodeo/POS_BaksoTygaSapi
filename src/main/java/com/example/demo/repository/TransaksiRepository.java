package com.example.demo.repository;

import com.example.demo.model.Transaksi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransaksiRepository extends JpaRepository<Transaksi, Long> {
    
    Optional<Transaksi> findByNoTrx(String noTrx);

    // 1. Ambil data transaksi dalam rentang waktu (DENGAN JOIN FETCH)
    // GANTI KE QUERY INI DI REPOSITORY LU:
    @Query("SELECT DISTINCT t FROM Transaksi t LEFT JOIN FETCH t.details WHERE t.tanggal BETWEEN :start AND :end ORDER BY t.tanggal DESC")
    List<Transaksi> findByTanggalBetweenOrderByTanggalDesc(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // 2. Hitung total uang masuk (menggunakan totalBayar dari modelmu)
    @Query("SELECT SUM(t.totalBayar) FROM Transaksi t WHERE t.tanggal BETWEEN :start AND :end")
    Double sumTotalBayarByTanggal(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // 3. Hitung total transaksi masuk
    @Query("SELECT COUNT(t) FROM Transaksi t WHERE t.tanggal BETWEEN :start AND :end")
    Long countTransaksiByTanggal(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // 4. Cari menu terlaris lewat join tabel TransaksiDetail (details)
    @Query("SELECT d.namaMenu, SUM(d.qty) FROM Transaksi t JOIN t.details d " +
           "WHERE t.tanggal BETWEEN :start AND :end " +
           "GROUP BY d.namaMenu ORDER BY SUM(d.qty) DESC")
    List<Object[]> findTopMenuByTanggal(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}