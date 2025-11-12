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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public RoomResponse createRoom(CreateRoomRequest request, Long userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("=== BACKEND CREATE ROOM DEBUG ===");
        System.out.println("Received request data:");
        System.out.println("Name: " + request.getName());
        System.out.println("RoomType: " + request.getRoomType());
        System.out.println("Area: " + request.getArea());
        System.out.println("Capacity: " + request.getCapacity());
        System.out.println("Amenities: " + request.getAmenities());
        System.out.println("Availability: " + request.getAvailability());
        System.out.println("=================================");

        Room room = new Room();
        room.setName(request.getName());
        room.setImageUrl(request.getImageUrl());
        room.setAdditionalImages(request.getAdditionalImages());
        room.setDetail(request.getDetail());
        room.setPrice(request.getPrice());
        room.setLocation(request.getLocation());
        room.setContact(request.getContact());
        room.setOwner(owner);
        room.setIsAvailable(true);

        // ✅ LƯU CÁC THÔNG TIN FILTER
        room.setRoomType(request.getRoomType());
        room.setArea(request.getArea());
        room.setCapacity(request.getCapacity());
        room.setAmenities(request.getAmenities());
        room.setAvailability(request.getAvailability());

        // ✅ SET ROOM QUANTITY
        Integer totalRooms = request.getTotalRooms() != null ? request.getTotalRooms() : 1;
        room.setTotalRooms(totalRooms);
        room.setAvailableRooms(totalRooms); // Initially all rooms are available

        Room savedRoom = roomRepository.save(room);

        System.out.println("=== SAVED ROOM DEBUG ===");
        System.out.println("Saved room data:");
        System.out.println("ID: " + savedRoom.getId());
        System.out.println("RoomType: " + savedRoom.getRoomType());
        System.out.println("Area: " + savedRoom.getArea());
        System.out.println("Capacity: " + savedRoom.getCapacity());
        System.out.println("Amenities: " + savedRoom.getAmenities());
        System.out.println("Availability: " + savedRoom.getAvailability());
        System.out.println("IsAvailable: " + savedRoom.getIsAvailable());
        System.out.println("=========================");

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
        if (request.getAdditionalImages() != null) room.setAdditionalImages(request.getAdditionalImages());
        if (request.getDetail() != null) room.setDetail(request.getDetail());
        if (request.getPrice() != null) room.setPrice(request.getPrice());
        if (request.getLocation() != null) room.setLocation(request.getLocation());
        if (request.getContact() != null) room.setContact(request.getContact());
        if (request.getIsAvailable() != null) room.setIsAvailable(request.getIsAvailable());
        if (request.getRoomType() != null) room.setRoomType(request.getRoomType());
        if (request.getArea() != null) room.setArea(request.getArea());
        if (request.getCapacity() != null) room.setCapacity(request.getCapacity());
        if (request.getAmenities() != null) room.setAmenities(request.getAmenities());
        if (request.getAvailability() != null) room.setAvailability(request.getAvailability());
        
        // Cost fields
        if (request.getElectricityCost() != null) room.setElectricityCost(request.getElectricityCost());
        if (request.getWaterCost() != null) room.setWaterCost(request.getWaterCost());
        if (request.getInternetCost() != null) room.setInternetCost(request.getInternetCost());
        if (request.getParkingFee() != null) room.setParkingFee(request.getParkingFee());
        if (request.getDeposit() != null) room.setDeposit(request.getDeposit());
        if (request.getDepositType() != null) room.setDepositType(request.getDepositType());

        // Room quantity management
        if (request.getTotalRooms() != null) {
            Integer oldTotal = room.getTotalRooms() != null ? room.getTotalRooms() : 1;
            Integer newTotal = request.getTotalRooms();
            room.setTotalRooms(newTotal);
            
            // Nếu tăng tổng số phòng, tăng cả số phòng còn trống tương ứng
            if (newTotal > oldTotal) {
                Integer currentAvailable = room.getAvailableRooms() != null ? room.getAvailableRooms() : oldTotal;
                room.setAvailableRooms(currentAvailable + (newTotal - oldTotal));
            }
            // Nếu giảm tổng số phòng, đảm bảo availableRooms không vượt quá totalRooms
            else if (newTotal < oldTotal) {
                Integer currentAvailable = room.getAvailableRooms() != null ? room.getAvailableRooms() : oldTotal;
                if (currentAvailable > newTotal) {
                    room.setAvailableRooms(newTotal);
                }
            }
        }
        
        // Cho phép chỉnh sửa trực tiếp availableRooms (nếu được gửi lên)
        if (request.getAvailableRooms() != null) {
            Integer totalRooms = room.getTotalRooms() != null ? room.getTotalRooms() : 1;
            Integer newAvailable = request.getAvailableRooms();
            
            // Không cho availableRooms vượt quá totalRooms
            if (newAvailable > totalRooms) {
                newAvailable = totalRooms;
            }
            
            room.setAvailableRooms(newAvailable);
            
            // Tự động cập nhật trạng thái dựa trên số phòng còn trống
            if (newAvailable == 0) {
                room.setIsAvailable(false);
                room.setAvailability("Hết phòng");
            } else if (newAvailable > 0 && !room.getIsAvailable()) {
                room.setIsAvailable(true);
                room.setAvailability("Còn trống");
            }
        }

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

    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        // Initialize owner within transaction
        if (room.getOwner() != null) {
            room.getOwner().getUsername();
        }
        return mapToResponse(room);
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getAllRooms() {
        List<Room> rooms = roomRepository.findAllWithOwner();
        // Initialize owners within transaction
        rooms.forEach(room -> {
            if (room.getOwner() != null) {
                room.getOwner().getUsername();
            }
        });
        return rooms.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long getRoomCount() {
        return roomRepository.count();
    }

    @Transactional(readOnly = true)
    public String debugAllRooms() {
        StringBuilder sb = new StringBuilder();
        sb.append("=== DEBUGGING ALL ROOMS ===\n");
        
        try {
            List<Room> allRooms = roomRepository.findAllWithOwner();
            sb.append("Total rooms: ").append(allRooms.size()).append("\n\n");
            
            for (Room room : allRooms) {
                sb.append("Room ID: ").append(room.getId()).append("\n");
                sb.append("  Name: ").append(room.getName()).append("\n");
                sb.append("  Owner: ").append(room.getOwner() != null ? room.getOwner().getUsername() : "NULL!").append("\n");
                sb.append("  Available: ").append(room.getIsAvailable()).append("\n");
                
                try {
                    mapToResponse(room);
                    sb.append("  Mapping: OK\n");
                } catch (Exception e) {
                    sb.append("  Mapping: FAILED - ").append(e.getMessage()).append("\n");
                }
                sb.append("\n");
            }
            
        } catch (Exception e) {
            sb.append("ERROR: ").append(e.getMessage());
            e.printStackTrace();
        }
        
        return sb.toString();
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getAvailableRooms() {
        try {
            System.out.println("=== GET ALL ROOMS DEBUG ===");
            // Changed to show ALL rooms, not just available ones - with owner eagerly fetched
            List<Room> rooms = roomRepository.findAllWithOwner();
            System.out.println("Found " + rooms.size() + " rooms in database");
            
            // Initialize owners within transaction to avoid LazyInitializationException
            rooms.forEach(room -> {
                if (room.getOwner() != null) {
                    room.getOwner().getUsername(); // Initialize lazy proxy
                }
            });
            
            List<RoomResponse> responses = rooms.stream()
                    .map(room -> {
                        try {
                            return mapToResponse(room);
                        } catch (Exception e) {
                            System.err.println("Error mapping room ID: " + room.getId() + " - " + e.getMessage());
                            e.printStackTrace();
                            throw e;
                        }
                    })
                    .collect(Collectors.toList());
            
            System.out.println("Successfully mapped " + responses.size() + " room responses");
            System.out.println("=================================");
            return responses;
        } catch (Exception e) {
            System.err.println("=== ERROR IN GET ALL ROOMS ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("====================================");
            throw e;
        }
    }

    public List<RoomResponse> getRoomsByOwner(Long userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return roomRepository.findByOwner(owner).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> searchRooms(String keyword, String location) {
        List<Room> rooms = roomRepository.findAllWithOwner();
        // Initialize owners within transaction
        rooms.forEach(room -> {
            if (room.getOwner() != null) {
                room.getOwner().getUsername();
            }
        });
        
        // Normalize keyword: chuyển lowercase và trim, nhưng GIỮ khoảng trắng
        String normalizedKeyword = keyword != null && !keyword.isEmpty() 
            ? keyword.toLowerCase().trim().replaceAll("\\s+", " ") // Chuẩn hóa nhiều space thành 1 space
            : null;
        
        String normalizedLocation = location != null && !location.isEmpty() 
            ? location.toLowerCase().trim().replaceAll("\\s+", " ")
            : null;
        
        // Filter rooms based on flexible search
        return rooms.stream()
                .filter(room -> {
                    // Nếu không có keyword và location, trả về tất cả
                    if ((normalizedKeyword == null || normalizedKeyword.isEmpty()) && 
                        (normalizedLocation == null || normalizedLocation.isEmpty())) {
                        return true;
                    }
                    
                    boolean matchKeyword = true;
                    boolean matchLocation = true;
                    
                    // Check keyword match (tìm trong name, location, detail, amenities, roomType)
                    if (normalizedKeyword != null && !normalizedKeyword.isEmpty()) {
                        matchKeyword = flexibleMatch(room.getName(), normalizedKeyword) ||
                                      flexibleMatch(room.getLocation(), normalizedKeyword) ||
                                      flexibleMatch(room.getDetail(), normalizedKeyword) ||
                                      flexibleMatch(room.getAmenities(), normalizedKeyword) ||
                                      flexibleMatch(room.getRoomType(), normalizedKeyword);
                    }
                    
                    // Check location match
                    if (normalizedLocation != null && !normalizedLocation.isEmpty()) {
                        matchLocation = flexibleMatch(room.getLocation(), normalizedLocation);
                    }
                    
                    return matchKeyword && matchLocation;
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    // Helper method for flexible matching
    private boolean flexibleMatch(String text, String keyword) {
        if (text == null || text.isEmpty()) {
            return false;
        }
        
        // Chuẩn hóa text: lowercase và normalize spaces
        String normalizedText = text.toLowerCase().trim().replaceAll("\\s+", " ");
        
        // 1. Exact match với space
        if (normalizedText.contains(keyword)) {
            return true;
        }
        
        // 2. Match khi loại bỏ space (cho trường hợp "thôn 4" vs "thôn4")
        String textNoSpace = normalizedText.replaceAll("\\s+", "");
        String keywordNoSpace = keyword.replaceAll("\\s+", "");
        
        return textNoSpace.contains(keywordNoSpace);
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> filterRooms(RoomFilterRequest filter) {
        // Changed to show ALL rooms, including unavailable ones - with owner eagerly fetched
        List<Room> rooms = roomRepository.findAllWithOwner();
        // Initialize owners within transaction
        rooms.forEach(room -> {
            if (room.getOwner() != null) {
                room.getOwner().getUsername();
            }
        });

        System.out.println("=== FILTER DEBUG ===");
        System.out.println("Total rooms: " + rooms.size());
        System.out.println("Filter roomTypes: " + filter.getRoomTypes());
        System.out.println("Filter areas: " + filter.getAreas());
        System.out.println("Filter amenities: " + filter.getAmenities());
        System.out.println("Filter capacity: " + filter.getCapacity());
        System.out.println("Filter availability: " + filter.getAvailability());

        List<RoomResponse> result = rooms.stream()
                .filter(room -> {
                    boolean matches = matchesFilter(room, filter);
                    if (!matches) {
                        System.out.println("Room " + room.getId() + " filtered out - roomType: " + room.getRoomType() + ", area: " + room.getArea() + ", amenities: " + room.getAmenities() + ", capacity: " + room.getCapacity() + ", availability: " + room.getAvailability());
                    }
                    return matches;
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        System.out.println("Result: " + result.size() + " rooms matched");
        System.out.println("===================");
        return result;
    }

    private boolean matchesFilter(Room room, RoomFilterRequest filter) {
        // Filter by room type - STRICT: nếu filter được set và room KHÔNG có giá trị → LOẠI BỎ
        if (filter.getRoomTypes() != null && !filter.getRoomTypes().isEmpty()) {
            if (room.getRoomType() == null || !filter.getRoomTypes().contains(room.getRoomType())) {
                return false;
            }
        }

        // Filter by price range (price luôn có giá trị)
        if (filter.getMinPrice() != null) {
            if (room.getPrice() < filter.getMinPrice()) {
                return false;
            }
        }
        if (filter.getMaxPrice() != null) {
            if (room.getPrice() > filter.getMaxPrice()) {
                return false;
            }
        }

        // Filter by area - STRICT
        if (filter.getAreas() != null && !filter.getAreas().isEmpty()) {
            if (room.getArea() == null) {
                return false;  // Loại bỏ phòng không có area
            }
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

        // Filter by amenities - STRICT
        if (filter.getAmenities() != null && !filter.getAmenities().isEmpty()) {
            if (room.getAmenities() == null) {
                return false;  // Loại bỏ phòng không có amenities
            }
            for (String amenity : filter.getAmenities()) {
                if (!room.getAmenities().contains(amenity)) {
                    return false;
                }
            }
        }

        // Filter by capacity - STRICT
        if (filter.getCapacity() != null) {
            if (room.getCapacity() == null) {
                return false;  // Loại bỏ phòng không có capacity
            }
            // Handle capacity ranges
            if (filter.getCapacity() == 1) {
                // "1-2 người"
                if (room.getCapacity() < 1 || room.getCapacity() > 2) {
                    return false;
                }
            } else if (filter.getCapacity() == 3) {
                // "3-4 người"
                if (room.getCapacity() < 3 || room.getCapacity() > 4) {
                    return false;
                }
            } else if (filter.getCapacity() == 4) {
                // "4+ người" (4 or more)
                if (room.getCapacity() < 4) {
                    return false;
                }
            } else {
                if (!room.getCapacity().equals(filter.getCapacity())) {
                    return false;
                }
            }
        }

        // Filter by availability - STRICT
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
        return mapToRoomResponse(room);
    }

    // Public method for other services to use
    public RoomResponse mapToRoomResponse(Room room) {
        try {
            Long ownerId = null;
            String ownerUsername = null;
            String ownerEmail = null;
            
            if (room.getOwner() != null) {
                ownerId = room.getOwner().getId();
                ownerUsername = room.getOwner().getUsername();
                ownerEmail = room.getOwner().getEmail();
            } else {
                System.err.println("WARNING: Room ID " + room.getId() + " has no owner!");
            }
            
            return RoomResponse.builder()
                    .id(room.getId())
                    .name(room.getName())
                    .imageUrl(room.getImageUrl())
                    .additionalImages(room.getAdditionalImages())
                    .detail(room.getDetail())
                    .price(room.getPrice())
                    .location(room.getLocation())
                    .contact(room.getContact())
                    .isAvailable(room.getIsAvailable())
                    .ownerId(ownerId)
                    .ownerUsername(ownerUsername)
                    .ownerEmail(ownerEmail)
                    .createdAt(room.getCreatedAt())
                    .updatedAt(room.getUpdatedAt())
                    .roomType(room.getRoomType())
                    .area(room.getArea())
                    .capacity(room.getCapacity())
                    .amenities(room.getAmenities())
                    .availability(room.getAvailability())
                    .electricityCost(room.getElectricityCost())
                    .waterCost(room.getWaterCost())
                    .internetCost(room.getInternetCost())
                    .parkingFee(room.getParkingFee())
                    .deposit(room.getDeposit())
                    .depositType(room.getDepositType())
                    .totalRooms(room.getTotalRooms())
                    .availableRooms(room.getAvailableRooms())
                    .build();
        } catch (Exception e) {
            System.err.println("ERROR mapping room ID: " + room.getId());
            e.printStackTrace();
            throw e;
        }
    }
}

