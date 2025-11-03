package com.x.group2_timtro.controller;

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

    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyRevenueResponse>> getMonthlyRevenue() {
        List<MonthlyRevenueResponse> data = revenueService.getMonthlyRevenue();
        return ResponseEntity.ok(data);
    }
}