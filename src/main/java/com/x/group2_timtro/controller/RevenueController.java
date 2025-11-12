package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.response.DailyRevenueResponse;
import com.x.group2_timtro.entity.Payment;
import com.x.group2_timtro.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RevenueController {

    private final RevenueService revenueService;

     @GetMapping("/months")
    public ResponseEntity<List<String>> getAvailableMonths() {
        return ResponseEntity.ok(revenueService.getAvailableMonths());
    }

    @GetMapping("/daily/{month}")
    public ResponseEntity<List<DailyRevenueResponse>> getDailyRevenueByMonth(@PathVariable String month) {
        return ResponseEntity.ok(revenueService.getDailyRevenueByMonth(month));
    }

    @GetMapping("/payments/{month}")
    public ResponseEntity<Page<Payment>> getPaymentsByMonth(
            @PathVariable String month,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(revenueService.getPaymentsByMonth(month, page, size));
    }
}