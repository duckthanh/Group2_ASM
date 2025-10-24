package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.request.CreateReportRequest;
import com.x.group2_timtro.dto.response.RoomReportResponse;
import com.x.group2_timtro.service.RoomReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class RoomReportController {

    private final RoomReportService roomReportService;

    @PostMapping("/rooms/{roomId}")
    public ResponseEntity<?> createReport(
            @PathVariable Long roomId,
            @RequestBody CreateReportRequest request,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            RoomReportResponse response = roomReportService.createReport(roomId, request, userEmail);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllReports() {
        try {
            List<RoomReportResponse> reports = roomReportService.getAllReports();
            return ResponseEntity.ok(reports);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getReportsByStatus(@PathVariable String status) {
        try {
            List<RoomReportResponse> reports = roomReportService.getReportsByStatus(status);
            return ResponseEntity.ok(reports);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<?> getReportsByRoom(@PathVariable Long roomId) {
        try {
            List<RoomReportResponse> reports = roomReportService.getReportsByRoom(roomId);
            return ResponseEntity.ok(reports);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{reportId}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable Long reportId,
            @RequestParam String status) {
        try {
            RoomReportResponse response = roomReportService.updateReportStatus(reportId, status);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

