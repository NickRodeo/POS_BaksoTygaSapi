package com.example.demo.service;

import com.example.demo.dto.LaporanDTO;

public interface LaporanService {
    LaporanDTO getLaporanByPeriode(String periode);
}