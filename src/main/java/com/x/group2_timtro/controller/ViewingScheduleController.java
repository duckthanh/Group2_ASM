package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.request.CreateViewingScheduleRequest;
import com.x.group2_timtro.dto.response.ViewingScheduleResponse;
import com.x.group2_timtro.service.ViewingScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/viewing-schedules")
@RequiredArgsConstructor
public class ViewingScheduleController {

    private final ViewingScheduleService viewingScheduleService;

    @PostMapping("/rooms/{roomId}")
    public ResponseEntity<?> createSchedule(
            @PathVariable Long roomId,
            @RequestBody CreateViewingScheduleRequest request,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            ViewingScheduleResponse response = viewingScheduleService.createSchedule(roomId, request, userEmail);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-schedules")
    public ResponseEntity<?> getUserSchedules(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<ViewingScheduleResponse> schedules = viewingScheduleService.getUserSchedules(userEmail);
            return ResponseEntity.ok(schedules);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<?> getRoomSchedules(@PathVariable Long roomId) {
        try {
            List<ViewingScheduleResponse> schedules = viewingScheduleService.getRoomSchedules(roomId);
            return ResponseEntity.ok(schedules);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getSchedulesByStatus(@PathVariable String status) {
        try {
            List<ViewingScheduleResponse> schedules = viewingScheduleService.getSchedulesByStatus(status);
            return ResponseEntity.ok(schedules);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{scheduleId}/status")
    public ResponseEntity<?> updateScheduleStatus(
            @PathVariable Long scheduleId,
            @RequestParam String status) {
        try {
            ViewingScheduleResponse response = viewingScheduleService.updateScheduleStatus(scheduleId, status);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<?> deleteSchedule(
            @PathVariable Long scheduleId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            viewingScheduleService.deleteSchedule(scheduleId, userEmail);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

