package com.example.demo;

import com.example.demo.dto.LaporanDTO;
import com.example.demo.service.LaporanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/laporan") // Base URL khusus fitur laporan
public class LaporanController {

    @Autowired
    private LaporanService laporanService;

    // Menampilkan halaman HTML Laporan
    // URL di browser: http://localhost:8080/laporan
    @GetMapping
    public String halamanLaporan(Model model) {
        model.addAttribute("pageActive", "laporan");
        return "LaporanTransaksi"; // Mengarah ke templates/LaporanTransaksi.html
    }

    // Endpoint API untuk ditarik (fetch) oleh JavaScript di frontend
    // URL API: http://localhost:8080/laporan/api?periode=harian
    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<LaporanDTO> getApiLaporan(@RequestParam(value = "periode", defaultValue = "mingguan") String periode) {
        LaporanDTO data = laporanService.getLaporanByPeriode(periode);
        return ResponseEntity.ok(data);
    }
}