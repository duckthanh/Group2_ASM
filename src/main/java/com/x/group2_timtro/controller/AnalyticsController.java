package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.response.RoomBookingStatsResponse;
import com.x.group2_timtro.service.RoomAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final RoomAnalyticsService roomAnalyticsService;

    @GetMapping("/top-booked-rooms")
    public List<RoomBookingStatsResponse> getTop9MostBookedRooms() {
        return roomAnalyticsService.getTop9MostBookedRooms();
    }

    @GetMapping("/user/{userId}/rooms")
    public ResponseEntity<?> getRoomStatsByOwner(@PathVariable Long userId) {
        List<RoomBookingStatsResponse> stats = roomAnalyticsService.getRoomStatsByOwner(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("totalRooms", stats.size());
        response.put("rooms", stats);

        return ResponseEntity.ok(response);
    }

}