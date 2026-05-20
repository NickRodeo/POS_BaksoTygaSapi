package com.example.demo.dto;

import java.util.List;

public class GrafikDTO {
    private String label;
    private List<String> labels;
    private List<Double> data; // Menggunakan Double agar presisi dengan nominal uangmu

    public GrafikDTO() {}

    public GrafikDTO(String label, List<String> labels, List<Double> data) {
        this.label = label;
        this.labels = labels;
        this.data = data;
    }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public List<String> getLabels() { return labels; }
    public void setLabels(List<String> labels) { this.labels = labels; }
    public List<Double> getData() { return data; }
    public void setData(List<Double> data) { this.data = data; }
}