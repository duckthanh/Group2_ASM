package com.x.group2_timtro.service;

import com.x.group2_timtro.dto.request.CreateViewingScheduleRequest;
import com.x.group2_timtro.dto.response.ViewingScheduleResponse;
import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.entity.ViewingSchedule;
import com.x.group2_timtro.repository.RoomRepository;
import com.x.group2_timtro.repository.UserRepository;
import com.x.group2_timtro.repository.ViewingScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ViewingScheduleService {

    private final ViewingScheduleRepository viewingScheduleRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Transactional
    @SuppressWarnings("null")
    public ViewingScheduleResponse createSchedule(Long roomId, CreateViewingScheduleRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        ViewingSchedule schedule = ViewingSchedule.builder()
                .room(room)
                .user(user)
                .viewingDate(request.getViewingDate())
                .viewingTime(request.getViewingTime())
                .visitorName(request.getVisitorName())
                .visitorPhone(request.getVisitorPhone())
                .notes(request.getNotes())
                .status("PENDING")
                .build();

        schedule = viewingScheduleRepository.save(schedule);

        return mapToResponse(schedule);
    }

    public List<ViewingScheduleResponse> getUserSchedules(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ViewingSchedule> schedules = viewingScheduleRepository.findByUserOrderByViewingDateDesc(user);
        return schedules.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public List<ViewingScheduleResponse> getRoomSchedules(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        List<ViewingSchedule> schedules = viewingScheduleRepository.findByRoomOrderByViewingDateDesc(room);
        return schedules.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ViewingScheduleResponse> getSchedulesByStatus(String status) {
        List<ViewingSchedule> schedules = viewingScheduleRepository.findByStatusOrderByViewingDateDesc(status);
        return schedules.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @SuppressWarnings("null")
    public ViewingScheduleResponse updateScheduleStatus(Long scheduleId, String status) {
        ViewingSchedule schedule = viewingScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        schedule.setStatus(status);
        
        if ("CONFIRMED".equals(status)) {
            schedule.setConfirmedAt(LocalDateTime.now());
        } else if ("CANCELLED".equals(status)) {
            schedule.setCancelledAt(LocalDateTime.now());
        }

        schedule = viewingScheduleRepository.save(schedule);
        return mapToResponse(schedule);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteSchedule(Long scheduleId, String userEmail) {
        ViewingSchedule schedule = viewingScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only the user who created the schedule or admin can delete
        if (schedule.getUser().getId() != user.getId() && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Unauthorized to delete this schedule");
        }

        viewingScheduleRepository.delete(schedule);
    }

    private ViewingScheduleResponse mapToResponse(ViewingSchedule schedule) {
        return ViewingScheduleResponse.builder()
                .id(schedule.getId())
                .roomId(schedule.getRoom().getId())
                .roomName(schedule.getRoom().getName())
                .userId(schedule.getUser().getId())
                .userName(schedule.getUser().getName())
                .viewingDate(schedule.getViewingDate())
                .viewingTime(schedule.getViewingTime())
                .visitorName(schedule.getVisitorName())
                .visitorPhone(schedule.getVisitorPhone())
                .status(schedule.getStatus())
                .notes(schedule.getNotes())
                .createdAt(schedule.getCreatedAt())
                .confirmedAt(schedule.getConfirmedAt())
                .cancelledAt(schedule.getCancelledAt())
                .build();
    }
}

