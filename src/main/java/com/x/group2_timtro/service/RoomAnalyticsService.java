package com.x.group2_timtro.service;

import com.x.group2_timtro.dto.response.RoomBookingStatsResponse;
import com.x.group2_timtro.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomAnalyticsService {

    private final RoomRepository roomRepository;

    public List<RoomBookingStatsResponse> getTop9MostBookedRooms() {
        List<RoomBookingStatsResponse> allRooms = roomRepository.findTopBookedRooms();
        return allRooms.stream().limit(9).toList(); // Only top 9
    }
}