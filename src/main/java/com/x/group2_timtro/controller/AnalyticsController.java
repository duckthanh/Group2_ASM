package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.response.RoomBookingStatsResponse;
import com.x.group2_timtro.service.RoomAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}