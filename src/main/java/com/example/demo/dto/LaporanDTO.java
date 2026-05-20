package com.example.demo.dto;

import java.util.List;

public class LaporanDTO {
    private String judul;
    private String topMenuJudul;
    private String judulGrafik;
    private String judulTabel;
    private String totalTransaksi;
    private String totalPendapatan;
    private List<String> topMenu;
    private GrafikDTO grafik;
    private List<String> tabel;

    public LaporanDTO() {}

    public LaporanDTO(String judul, String topMenuJudul, String judulGrafik, String judulTabel, 
                      String totalTransaksi, String totalPendapatan, List<String> topMenu, 
                      GrafikDTO grafik, List<String> tabel) {
        this.judul = judul;
        this.topMenuJudul = topMenuJudul;
        this.judulGrafik = judulGrafik;
        this.judulTabel = judulTabel;
        this.totalTransaksi = totalTransaksi;
        this.totalPendapatan = totalPendapatan;
        this.topMenu = topMenu;
        this.grafik = grafik;
        this.tabel = tabel;
    }

    public String getJudul() { return judul; }
    public void setJudul(String judul) { this.judul = judul; }
    public String getTopMenuJudul() { return topMenuJudul; }
    public void setTopMenuJudul(String topMenuJudul) { this.topMenuJudul = topMenuJudul; }
    public String getJudulGrafik() { return judulGrafik; }
    public void setJudulGrafik(String judulGrafik) { this.judulGrafik = judulGrafik; }
    public String getJudulTabel() { return judulTabel; }
    public void setJudulTabel(String judulTabel) { this.judulTabel = judulTabel; }
    public String getTotalTransaksi() { return totalTransaksi; }
    public void setTotalTransaksi(String totalTransaksi) { this.totalTransaksi = totalTransaksi; }
    public String getTotalPendapatan() { return totalPendapatan; }
    public void setTotalPendapatan(String totalPendapatan) { this.totalPendapatan = totalPendapatan; }
    public List<String> getTopMenu() { return topMenu; }
    public void setTopMenu(List<String> topMenu) { this.topMenu = topMenu; }
    public GrafikDTO getGrafik() { return grafik; }
    public void setGrafik(GrafikDTO grafik) { this.grafik = grafik; }
    public List<String> getTabel() { return tabel; }
    public void setTabel(List<String> tabel) { this.tabel = tabel; }
}