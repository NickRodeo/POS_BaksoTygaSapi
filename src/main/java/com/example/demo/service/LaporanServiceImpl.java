package com.example.demo.service;

import com.example.demo.dto.GrafikDTO;
import com.example.demo.dto.LaporanDTO;
import com.example.demo.model.Transaksi;
import com.example.demo.repository.TransaksiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.NumberFormat;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LaporanServiceImpl implements LaporanService {

    @Autowired
    private TransaksiRepository transaksiRepository;

    @Override
    @Transactional(readOnly = true)
    public LaporanDTO getLaporanByPeriode(String periode) {
        LocalDateTime start;
        LocalDateTime end;
        
        String judul;
        String topMenuJudul;
        String judulGrafik;
        String judulTabel;
        
        List<String> labels = new ArrayList<>();
        List<Double> dataGrafik = new ArrayList<>();

        // 1. TENTUKAN RANGE TANGGAL BERDASARKAN PARAMETER FILTER
        if ("harian".equalsIgnoreCase(periode)) {
            LocalDate hariIni = LocalDate.now();
            start = hariIni.atStartOfDay();
            end = hariIni.atTime(LocalTime.MAX);
            
            judul = "Laporan Penjualan Hari Ini (" + hariIni.format(DateTimeFormatter.ofPattern("dd MMM yyyy")) + ")";
            topMenuJudul = "Menu Terlaris Hari Ini";
            judulGrafik = "Tren Penjualan Per Jam (Hari Ini)";
            judulTabel = "Riwayat Transaksi Hari Ini";
            
            // Menggunakan 5 slot waktu utama sesuai dengan setup halaman awal lu
            labels = Arrays.asList("10:00", "13:00", "16:00", "19:00", "22:00");
        } else {
            // Default: Mingguan
            LocalDate hariIni = LocalDate.now();
            LocalDate senin = hariIni.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            LocalDate minggu = hariIni.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
            
            start = senin.atStartOfDay();
            end = minggu.atTime(LocalTime.MAX);
            
            judul = "Laporan Penjualan Minggu Ini";
            topMenuJudul = "5 Menu Terlaris Minggu Ini";
            judulGrafik = "Tren Penjualan Mingguan";
            judulTabel = "Riwayat Transaksi Minggu Ini";
            
            labels = Arrays.asList("Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu");
        }

        // 2. QUERY AGREGASI UTAMA DARI DB
        Long totalTx = transaksiRepository.countTransaksiByTanggal(start, end);
        Double totalOmset = transaksiRepository.sumTotalBayarByTanggal(start, end);
        if (totalOmset == null) totalOmset = 0.0;

        // Format Uang Rupiah (IDR)
        Locale localeID = new Locale("in", "ID");
        NumberFormat formatRupiah = NumberFormat.getCurrencyInstance(localeID);
        String txtPendapatan = formatRupiah.format(totalOmset).replace(",00", "");
        String txtTransaksi = (totalTx != null ? totalTx : 0) + " Transaksi";

        // 3. GENERATE LIST TOP MENU TERLARIS (HTML <li>)
        List<Object[]> rawTopMenu = transaksiRepository.findTopMenuByTanggal(start, end);
        List<String> listTopMenuHtml = new ArrayList<>();
        
        int limitMenu = Math.min(rawTopMenu.size(), 5);
        for (int i = 0; i < limitMenu; i++) {
            Object[] row = rawTopMenu.get(i);
            String namaMenu = (String) row[0];
            Long totalQty = (Long) row[1];
            listTopMenuHtml.add("<li><span>" + namaMenu + "</span><strong>" + totalQty + " Porsi</strong></li>");
        }
        if (listTopMenuHtml.isEmpty()) {
            listTopMenuHtml.add("<li><span style='color: #888;'>Belum ada transaksi</span></li>");
        }

        // 4. AMBIL LIST TRANSAKSI RIIL DARI DATABASE
        List<Transaksi> listTransaksi = transaksiRepository.findByTanggalBetweenOrderByTanggalDesc(start, end);

        // 5. MAPPING DATA GRAFIK RIIL (MENGHAPUS LOGIKA SIMULASI RANDOM KEMAREN)
        if ("harian".equalsIgnoreCase(periode)) {
            // Inisialisasi map jam bernilai awal 0.0
            Map<String, Double> mapJam = new LinkedHashMap<>();
            mapJam.put("10:00", 0.0);
            mapJam.put("13:00", 0.0);
            mapJam.put("16:00", 0.0);
            mapJam.put("19:00", 0.0);
            mapJam.put("22:00", 0.0);

            for (Transaksi t : listTransaksi) {
                int jam = t.getTanggal().getHour();
                String slotTerdekat;
                // Cari kecocokan slot jam terdekat
                if (jam < 12) slotTerdekat = "10:00";
                else if (jam < 15) slotTerdekat = "13:00";
                else if (jam < 18) slotTerdekat = "16:00";
                else if (jam < 21) slotTerdekat = "19:00";
                else slotTerdekat = "22:00";

                mapJam.put(slotTerdekat, mapJam.get(slotTerdekat) + t.getTotalBayar());
            }
            dataGrafik = new ArrayList<>(mapJam.values());
        } else {
            // Inisialisasi map nama hari bernilai awal 0.0
            Map<String, Double> mapHari = new LinkedHashMap<>();
            mapHari.put("Senin", 0.0);
            mapHari.put("Selasa", 0.0);
            mapHari.put("Rabu", 0.0);
            mapHari.put("Kamis", 0.0);
            mapHari.put("Jumat", 0.0);
            mapHari.put("Sabtu", 0.0);
            mapHari.put("Minggu", 0.0);

            // Cocokkan DayOfWeek Java ke String label hari kita
            Map<DayOfWeek, String> konversiHari = new HashMap<>();
            konversiHari.put(DayOfWeek.MONDAY, "Senin");
            konversiHari.put(DayOfWeek.TUESDAY, "Selasa");
            konversiHari.put(DayOfWeek.WEDNESDAY, "Rabu");
            konversiHari.put(DayOfWeek.THURSDAY, "Kamis");
            konversiHari.put(DayOfWeek.FRIDAY, "Jumat");
            konversiHari.put(DayOfWeek.SATURDAY, "Sabtu");
            konversiHari.put(DayOfWeek.SUNDAY, "Minggu");

            for (Transaksi t : listTransaksi) {
                DayOfWeek day = t.getTanggal().getDayOfWeek();
                String namaHariIndo = konversiHari.get(day);
                if (mapHari.containsKey(namaHariIndo)) {
                    mapHari.put(namaHariIndo, mapHari.get(namaHariIndo) + t.getTotalBayar());
                }
            }
            dataGrafik = new ArrayList<>(mapHari.values());
        }
        
        GrafikDTO grafik = new GrafikDTO("Pendapatan (Rp)", labels, dataGrafik);

        // 6. GENERATE BARIS TABEL TRANSAKSI (HTML <tr>) - TETAP AMAN DARI RELASI DETAILS
        List<String> listTabelHtml = new ArrayList<>();
        DateTimeFormatter formatJam = DateTimeFormatter.ofPattern("HH:mm");

        for (Transaksi t : listTransaksi) {
            // Mengambil detail item belanjaan langsung lewat stream map model yang lu kasih
            String detailPesanan = t.getDetails().stream()
                    .map(d -> d.getQty() + "x " + d.getNamaMenu())
                    .collect(Collectors.joining(", "));
            System.out.println("TRX = " + t.getNoTrx());
            System.out.println("DETAIL SIZE = " + t.getDetails().size());
            System.out.println("DETAILS = " + t.getDetails());
            if (detailPesanan.isEmpty()) {
                detailPesanan = "-";
            }

            String rowHtml = "<tr>" +
                    "<td><strong>" + t.getNoTrx() + "</strong></td>" +
                    "<td>" + t.getTanggal().format(formatJam) + " WIB</td>" +
                    "<td>" + detailPesanan + "</td>" +
                    "<td>" + formatRupiah.format(t.getTotalBayar()).replace(",00", "") + "</td>" +
                    "<td><span class='status-badge status-selesai'>Selesai</span></td>" +
                    "</tr>";
            listTabelHtml.add(rowHtml);
        }
        
        if (listTabelHtml.isEmpty()) {
            listTabelHtml.add("<tr><td colspan='5' style='text-align:center;'>Tidak ada data transaksi pada periode ini.</td></tr>");
        }

        // 7. KEMBALIKAN BUNDEL DTO
        return new LaporanDTO(
                judul, topMenuJudul, judulGrafik, judulTabel,
                txtTransaksi, txtPendapatan, listTopMenuHtml, grafik, listTabelHtml
        );
    }
}