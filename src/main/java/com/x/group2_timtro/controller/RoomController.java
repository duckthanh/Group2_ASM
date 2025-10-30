package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.request.CreateRoomRequest;
import com.x.group2_timtro.dto.request.RoomFilterRequest;
import com.x.group2_timtro.dto.request.UpdateRoomRequest;
import com.x.group2_timtro.dto.response.RoomResponse;
import com.x.group2_timtro.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(
            @RequestBody CreateRoomRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        log.info("Creating room for user: {}", userId);
        RoomResponse response = roomService.createRoom(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable Long roomId,
            @RequestBody UpdateRoomRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        log.info("Updating room: {} by user: {}", roomId, userId);
        RoomResponse response = roomService.updateRoom(roomId, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable Long roomId,
            @RequestHeader("X-User-Id") Long userId) {
        log.info("Deleting room: {} by user: {}", roomId, userId);
        roomService.deleteRoom(roomId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long roomId) {
        log.info("Getting room: {}", roomId);
        RoomResponse response = roomService.getRoomById(roomId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        log.info("Getting all rooms");
        List<RoomResponse> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/available")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms() {
        try {
            log.info("Getting available rooms");
            List<RoomResponse> rooms = roomService.getAvailableRooms();
            log.info("Found {} available rooms", rooms.size());
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            log.error("Error getting available rooms", e);
            throw e;
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        try {
            log.info("Test endpoint called");
            long count = roomService.getRoomCount();
            return ResponseEntity.ok("Backend is working! Total rooms in database: " + count);
        } catch (Exception e) {
            log.error("Error in test endpoint", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/debug")
    public ResponseEntity<String> debugRooms() {
        try {
            log.info("Debug endpoint called");
            String debug = roomService.debugAllRooms();
            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            log.error("Error in debug endpoint", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage() + "\nStack: " + e.getStackTrace()[0]);
        }
    }

    @GetMapping("/my-rooms")
    public ResponseEntity<List<RoomResponse>> getMyRooms(@RequestHeader("X-User-Id") Long userId) {
        log.info("Getting rooms for user: {}", userId);
        List<RoomResponse> rooms = roomService.getRoomsByOwner(userId);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/search")
    public ResponseEntity<List<RoomResponse>> searchRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location) {
        log.info("Searching rooms with keyword: {}, location: {}", keyword, location);
        List<RoomResponse> rooms = roomService.searchRooms(keyword, location);
        return ResponseEntity.ok(rooms);
    }

    @PostMapping("/filter")
    public ResponseEntity<List<RoomResponse>> filterRooms(@RequestBody RoomFilterRequest filter) {
        log.info("Filtering rooms with criteria: {}", filter);
        List<RoomResponse> rooms = roomService.filterRooms(filter);
        return ResponseEntity.ok(rooms);
    }
}

