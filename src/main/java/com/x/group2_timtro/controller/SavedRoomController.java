package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.response.SavedRoomResponse;
import com.x.group2_timtro.service.SavedRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-rooms")
@RequiredArgsConstructor
public class SavedRoomController {

    private final SavedRoomService savedRoomService;

    @PostMapping("/{roomId}")
    public ResponseEntity<?> saveRoom(
            @PathVariable Long roomId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            SavedRoomResponse response = savedRoomService.saveRoom(roomId, userEmail);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<?> unsaveRoom(
            @PathVariable Long roomId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            savedRoomService.unsaveRoom(roomId, userEmail);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserSavedRooms(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<SavedRoomResponse> rooms = savedRoomService.getUserSavedRooms(userEmail);
            return ResponseEntity.ok(rooms);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{roomId}/check")
    public ResponseEntity<?> checkIfSaved(
            @PathVariable Long roomId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            boolean saved = savedRoomService.isRoomSaved(roomId, userEmail);
            return ResponseEntity.ok(Map.of("saved", saved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

