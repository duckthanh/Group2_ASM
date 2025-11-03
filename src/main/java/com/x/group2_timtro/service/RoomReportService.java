package com.x.group2_timtro.service;

import com.x.group2_timtro.dto.request.CreateReportRequest;
import com.x.group2_timtro.dto.response.RoomReportResponse;
import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.RoomReport;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.repository.RoomReportRepository;
import com.x.group2_timtro.repository.RoomRepository;
import com.x.group2_timtro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class RoomReportService {

    private final RoomReportRepository roomReportRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Transactional
    public RoomReportResponse createReport(Long roomId, CreateReportRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        RoomReport report = RoomReport.builder()
                .room(room)
                .reporter(user)
                .reason(request.getReason())
                .description(request.getDescription())
                .status("PENDING")
                .build();

        report = roomReportRepository.save(report);

        return mapToResponse(report);
    }

    public List<RoomReportResponse> getAllReports() {
        List<RoomReport> reports = roomReportRepository.findAllByOrderByReportedAtDesc();
        return reports.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RoomReportResponse> getReportsByStatus(String status) {
        List<RoomReport> reports = roomReportRepository.findByStatusOrderByReportedAtDesc(status);
        return reports.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RoomReportResponse> getReportsByRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        List<RoomReport> reports = roomReportRepository.findByRoomOrderByReportedAtDesc(room);
        return reports.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RoomReportResponse updateReportStatus(Long reportId, String status) {
        RoomReport report = roomReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(status);
        if ("RESOLVED".equals(status) || "REJECTED".equals(status)) {
            report.setResolvedAt(LocalDateTime.now());
        }

        report = roomReportRepository.save(report);
        return mapToResponse(report);
    }

    private RoomReportResponse mapToResponse(RoomReport report) {
        return RoomReportResponse.builder()
                .id(report.getId())
                .roomId(report.getRoom().getId())
                .reporterId(report.getReporter().getId())
                .reporterName(report.getReporter().getName())
                .reason(report.getReason())
                .description(report.getDescription())
                .status(report.getStatus())
                .reportedAt(report.getReportedAt())
                .resolvedAt(report.getResolvedAt())
                .build();
    }
}

