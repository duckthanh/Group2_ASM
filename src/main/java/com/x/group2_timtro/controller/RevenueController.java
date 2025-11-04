package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.response.DailyRevenueResponse;
import com.x.group2_timtro.dto.response.MonthlyRevenueResponse;
import com.x.group2_timtro.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
public class RevenueController {

    private final RevenueService revenueService;

    // 📅 Get all available months with payments
    @GetMapping("/months")
    public ResponseEntity<List<String>> getAvailableMonths() {
        List<String> months = revenueService.getAvailableMonths();
        return ResponseEntity.ok(months);
    }

    // 💰 Get daily revenue for specific month
    @GetMapping("/daily/{month}")
    public ResponseEntity<List<DailyRevenueResponse>> getDailyRevenueByMonth(@PathVariable String month) {
        List<DailyRevenueResponse> revenues = revenueService.getDailyRevenueByMonth(month);
        return ResponseEntity.ok(revenues);
    }
}