package com.x.group2_timtro.service;

import com.x.group2_timtro.dto.request.CreateRoomRequest;
import com.x.group2_timtro.dto.request.RoomFilterRequest;
import com.x.group2_timtro.dto.request.UpdateRoomRequest;
import com.x.group2_timtro.dto.response.RoomResponse;
import com.x.group2_timtro.entity.Booking;
import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.repository.BookingRepository;
import com.x.group2_timtro.repository.RoomRepository;
import com.x.group2_timtro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public RoomResponse createRoom(CreateRoomRequest request, Long userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = new Room();
        room.setName(request.getName());
        room.setImageUrl(request.getImageUrl());
        room.setDetail(request.getDetail());
        room.setPrice(request.getPrice());
        room.setLocation(request.getLocation());
        room.setContact(request.getContact());
        room.setOwner(owner);
        room.setIsAvailable(true);

        Room savedRoom = roomRepository.save(room);
        return mapToResponse(savedRoom);
    }

    public RoomResponse updateRoom(Long roomId, UpdateRoomRequest request, Long userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Admin có thể cập nhật bất kỳ phòng nào, user thường chỉ cập nhật được phòng của mình
        if (!"ADMIN".equals(user.getRole()) && room.getOwner().getId() != userId) {
            throw new RuntimeException("You don't have permission to update this room");
        }

        if (request.getName() != null) room.setName(request.getName());
        if (request.getImageUrl() != null) room.setImageUrl(request.getImageUrl());
        if (request.getDetail() != null) room.setDetail(request.getDetail());
        if (request.getPrice() != null) room.setPrice(request.getPrice());
        if (request.getLocation() != null) room.setLocation(request.getLocation());
        if (request.getContact() != null) room.setContact(request.getContact());
        if (request.getIsAvailable() != null) room.setIsAvailable(request.getIsAvailable());

        Room updatedRoom = roomRepository.save(room);
        return mapToResponse(updatedRoom);
    }

    public void deleteRoom(Long roomId, Long userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Admin có thể xóa bất kỳ phòng nào, user thường chỉ xóa được phòng của mình
        if (!"ADMIN".equals(user.getRole()) && room.getOwner().getId() != userId) {
            throw new RuntimeException("You don't have permission to delete this room");
        }

        // Xóa tất cả các booking liên quan đến phòng này trước
        List<Booking> bookings = bookingRepository.findByRoom(room);
        if (!bookings.isEmpty()) {
            bookingRepository.deleteAll(bookings);
        }

        roomRepository.delete(room);
    }

    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return mapToResponse(room);
    }

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RoomResponse> getAvailableRooms() {
        return roomRepository.findByIsAvailable(true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RoomResponse> getRoomsByOwner(Long userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return roomRepository.findByOwner(owner).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RoomResponse> searchRooms(String keyword, String location) {
        List<Room> rooms;
        
        if (keyword != null && !keyword.isEmpty() && location != null && !location.isEmpty()) {
            // Tìm theo cả keyword và location
            rooms = roomRepository.findByNameContainingIgnoreCaseAndLocationContainingIgnoreCase(
                keyword, location);
        } else if (keyword != null && !keyword.isEmpty()) {
            // Tìm theo keyword (tìm trong name, location, detail)
            rooms = roomRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrDetailContainingIgnoreCase(
                keyword, keyword, keyword);
        } else if (location != null && !location.isEmpty()) {
            // Chỉ tìm theo location
            rooms = roomRepository.findByLocationContainingIgnoreCase(location);
        } else {
            // Không có keyword, trả về phòng còn trống
            rooms = roomRepository.findByIsAvailable(true);
        }
        
        return rooms.stream()
                .filter(Room::getIsAvailable) // Chỉ lấy phòng còn trống
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RoomResponse> filterRooms(RoomFilterRequest filter) {
        List<Room> rooms = roomRepository.findByIsAvailable(true);
        
        return rooms.stream()
                .filter(room -> matchesFilter(room, filter))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private boolean matchesFilter(Room room, RoomFilterRequest filter) {
        // Filter by room type
        if (filter.getRoomTypes() != null && !filter.getRoomTypes().isEmpty()) {
            if (room.getRoomType() == null || !filter.getRoomTypes().contains(room.getRoomType())) {
                return false;
            }
        }

        // Filter by price range
        if (filter.getMinPrice() != null && room.getPrice() < filter.getMinPrice()) {
            return false;
        }
        if (filter.getMaxPrice() != null && room.getPrice() > filter.getMaxPrice()) {
            return false;
        }

        // Filter by area
        if (filter.getAreas() != null && !filter.getAreas().isEmpty() && room.getArea() != null) {
            boolean matchesArea = false;
            for (String areaRange : filter.getAreas()) {
                if (matchesAreaRange(room.getArea(), areaRange)) {
                    matchesArea = true;
                    break;
                }
            }
            if (!matchesArea) {
                return false;
            }
        }

        // Filter by amenities
        if (filter.getAmenities() != null && !filter.getAmenities().isEmpty()) {
            if (room.getAmenities() == null) {
                return false;
            }
            for (String amenity : filter.getAmenities()) {
                if (!room.getAmenities().contains(amenity)) {
                    return false;
                }
            }
        }

        // Filter by capacity
        if (filter.getCapacity() != null) {
            if (room.getCapacity() == null) {
                return false;
            }
            // Handle "4+ người" case (capacity = 4 means 4 or more)
            if (filter.getCapacity() == 4) {
                if (room.getCapacity() < 4) {
                    return false;
                }
            } else if (filter.getCapacity() == 3) {
                // "3-4 người"
                if (room.getCapacity() < 3 || room.getCapacity() > 4) {
                    return false;
                }
            } else {
                if (!room.getCapacity().equals(filter.getCapacity())) {
                    return false;
                }
            }
        }

        // Filter by availability
        if (filter.getAvailability() != null && !filter.getAvailability().isEmpty()) {
            if (room.getAvailability() == null || !room.getAvailability().equals(filter.getAvailability())) {
                return false;
            }
        }

        return true;
    }

    private boolean matchesAreaRange(Double area, String range) {
        switch (range) {
            case "<15":
                return area < 15;
            case "15-20":
                return area >= 15 && area <= 20;
            case "20-30":
                return area >= 20 && area <= 30;
            case ">30":
                return area > 30;
            default:
                return false;
        }
    }

    private RoomResponse mapToResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .imageUrl(room.getImageUrl())
                .detail(room.getDetail())
                .price(room.getPrice())
                .location(room.getLocation())
                .contact(room.getContact())
                .isAvailable(room.getIsAvailable())
                .ownerId(room.getOwner().getId())
                .ownerUsername(room.getOwner().getUsername())
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .roomType(room.getRoomType())
                .area(room.getArea())
                .capacity(room.getCapacity())
                .amenities(room.getAmenities())
                .availability(room.getAvailability())
                .build();
    }
}

