package com.x.group2_timtro.service;

import com.x.group2_timtro.dto.response.SavedRoomResponse;
import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.SavedRoom;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.repository.RoomRepository;
import com.x.group2_timtro.repository.SavedRoomRepository;
import com.x.group2_timtro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedRoomService {

    private final SavedRoomRepository savedRoomRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomService roomService;

    @Transactional
    public SavedRoomResponse saveRoom(Long roomId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Check if already saved
        if (savedRoomRepository.existsByUserAndRoom(user, room)) {
            throw new RuntimeException("Room already saved");
        }

        SavedRoom savedRoom = SavedRoom.builder()
                .user(user)
                .room(room)
                .build();

        savedRoom = savedRoomRepository.save(savedRoom);

        return mapToResponse(savedRoom);
    }

    @Transactional
    public void unsaveRoom(Long roomId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        savedRoomRepository.deleteByUserAndRoom(user, room);
    }

    public List<SavedRoomResponse> getUserSavedRooms(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<SavedRoom> savedRooms = savedRoomRepository.findByUserOrderBySavedAtDesc(user);

        return savedRooms.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public boolean isRoomSaved(Long roomId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        return savedRoomRepository.existsByUserAndRoom(user, room);
    }

    private SavedRoomResponse mapToResponse(SavedRoom savedRoom) {
        return SavedRoomResponse.builder()
                .id(savedRoom.getId())
                .roomId(savedRoom.getRoom().getId())
                .userId(savedRoom.getUser().getId())
                .room(roomService.mapToRoomResponse(savedRoom.getRoom()))
                .savedAt(savedRoom.getSavedAt())
                .build();
    }
}

