package com.example.demo;

import com.example.demo.model.Menu;
import com.example.demo.model.Transaksi;
import com.example.demo.model.TransaksiDetail;
import com.example.demo.repository.MenuRepository;
import com.example.demo.repository.TransaksiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/transaksi")
public class TransaksiController {

    @Autowired
    private TransaksiRepository transaksiRepository;
    
    @Autowired
    private MenuRepository menuRepository;

    @PostMapping("/bayar")
    @ResponseBody
    public Map<String, Object> prosesBayar(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            Transaksi trx = new Transaksi();
            
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
            trx.setNoTrx("TR-" + timestamp);
            
            trx.setTanggal(LocalDateTime.now());
            trx.setNamaKasir(authentication != null ? authentication.getName() : "Sistem");
            trx.setSubtotal(Double.parseDouble(payload.get("subtotal").toString()));
            trx.setTotalBayar(Double.parseDouble(payload.get("totalBayar").toString()));
            trx.setTunai(Double.parseDouble(payload.get("tunai").toString()));
            trx.setKembali(Double.parseDouble(payload.get("kembali").toString()));

            List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
            for (Map<String, Object> item : items) {
                // 1. Ambil nama menu dari item
                String namaMenu = item.get("namaMenu").toString();
                int qtyDibeli = Integer.parseInt(item.get("qty").toString());

                // 2. Cari Menu di database
                Menu menu = menuRepository.findByNama(namaMenu)
                    .orElseThrow(() -> new RuntimeException("Menu " + namaMenu + " tidak ditemukan"));

                // 3. Validasi stok (opsional tapi disarankan)
                if (menu.getStok() < qtyDibeli) {
                    throw new RuntimeException("Stok " + namaMenu + " tidak cukup!");
                }

                // 4. Kurangi stok dan simpan
                menu.setStok(menu.getStok() - qtyDibeli);
                menuRepository.save(menu); // Update stok di database
    
                TransaksiDetail detail = new TransaksiDetail();
                detail.setNamaMenu(item.get("namaMenu").toString());
                detail.setQty(Integer.parseInt(item.get("qty").toString()));
                detail.setHargaSatuan(Double.parseDouble(item.get("hargaSatuan").toString()));
                detail.setSubtotalItem(Double.parseDouble(item.get("subtotalItem").toString()));
                detail.setTransaksi(trx);
                trx.getDetails().add(detail);
            }
            System.out.println("Jumlah detail sebelum save: " + trx.getDetails().size());
            transaksiRepository.save(trx);
            transaksiRepository.flush();
            for (TransaksiDetail d : trx.getDetails()) {
                System.out.println("id : " + d.getId());
                System.out.println("qty : " + d.getQty());
                System.out.println("subtotal : " + d.getSubtotalItem());
                System.out.println("transaksi : " + d.getTransaksi());
            }
            return Map.of("success", true, "redirectUrl", "/transaksi/struk/" + trx.getNoTrx());
            
        } catch (Exception e) {
            return Map.of("success", false, "message", "Gagal menyimpan transaksi: " + e.getMessage());
        }
    }

    @GetMapping("/struk/{noTrx}")
    public String tampilStruk(@PathVariable String noTrx, Model model) {
        Transaksi trx = transaksiRepository.findByNoTrx(noTrx)
                .orElseThrow(() -> new IllegalArgumentException("Transaksi tidak ditemukan: " + noTrx));
        
        model.addAttribute("trx", trx);
        return "struk";
    }
}