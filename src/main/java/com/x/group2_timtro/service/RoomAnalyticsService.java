package com.x.group2_timtro.service;

import com.x.group2_timtro.dto.response.RoomBookingStatsResponse;
import com.x.group2_timtro.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomAnalyticsService {

    private final RoomRepository roomRepository;

    public List<RoomBookingStatsResponse> getTop9MostBookedRooms() {
        List<RoomBookingStatsResponse> allRooms = roomRepository.findTopBookedRooms();
        return allRooms.stream().limit(9).toList(); // Only top 9
    }

    public List<RoomBookingStatsResponse> getRoomStatsByOwner(Long userId) {
        try {
            log.info("Fetching room stats for owner with ID: {}", userId);
            List<RoomBookingStatsResponse> results = roomRepository.getRoomStatsByOwner(userId);
            log.info("Found {} rooms for owner {}", results.size(), userId);
            return results;
        } catch (Exception e) {
            log.error("Error fetching room stats for owner {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Không thể tải dữ liệu thống kê phòng.", e);
        }
    }
}