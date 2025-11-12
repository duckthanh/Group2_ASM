package com.x.group2_timtro.service;

import com.x.group2_timtro.dto.request.CreateBookingRequest;
import com.x.group2_timtro.dto.response.BookingResponse;
import com.x.group2_timtro.entity.Booking;
import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.repository.BookingRepository;
import com.x.group2_timtro.repository.RoomRepository;
import com.x.group2_timtro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public BookingResponse createBooking(CreateBookingRequest request, Long userId) {
        // Kiểm tra số người (tối đa 3)
        if (request.getNumberOfPeople() > 3) {
            throw new RuntimeException("Số người tối đa là 3");
        }

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Check if user is trying to rent their own room
        if (Objects.equals(room.getOwner().getId(), userId)) {
            throw new RuntimeException("Chủ trọ không thể thuê phòng của chính mình");
        }

        if (!room.getIsAvailable()) {
            throw new RuntimeException("Room is not available");
        }

        // Check if there are available rooms
        if (room.getAvailableRooms() != null && room.getAvailableRooms() <= 0) {
            throw new RuntimeException("No rooms available");
        }

        User tenant = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setTenant(tenant);
        booking.setDuration(request.getDuration());
        booking.setDurationUnit(request.getDurationUnit());
        booking.setMoveInDate(request.getMoveInDate());
        booking.setNumberOfPeople(request.getNumberOfPeople());
        booking.setPhoneNumber(request.getPhoneNumber());
        booking.setNote(request.getNote());
        booking.setIsDeposit(request.getIsDeposit());
        booking.setStatus("PENDING");

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    public BookingResponse confirmBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Kiểm tra quyền (chỉ chủ phòng mới có thể confirm)
        if (booking.getRoom().getOwner().getId() != userId) {
            throw new RuntimeException("You don't have permission to confirm this booking");
        }

        booking.setStatus("CONFIRMED");
        
        // Giảm số phòng còn trống
        Room room = booking.getRoom();
        if (room.getAvailableRooms() != null && room.getAvailableRooms() > 0) {
            room.setAvailableRooms(room.getAvailableRooms() - 1);
            
            // Nếu hết phòng, tự động chuyển sang "Hết phòng"
            if (room.getAvailableRooms() == 0) {
                room.setIsAvailable(false);
                room.setAvailability("Hết phòng");
            }
            
            roomRepository.save(room);
        }

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }

    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Người thuê hoặc chủ phòng đều có thể hủy
        if (booking.getTenant().getId() != userId && 
            booking.getRoom().getOwner().getId() != userId) {
            throw new RuntimeException("You don't have permission to cancel this booking");
        }

        // Nếu booking đang CONFIRMED, tăng lại số phòng còn trống
        if ("CONFIRMED".equals(booking.getStatus())) {
            Room room = booking.getRoom();
            if (room.getAvailableRooms() != null && room.getTotalRooms() != null) {
                int newAvailable = room.getAvailableRooms() + 1;
                
                // Không vượt quá tổng số phòng
                if (newAvailable <= room.getTotalRooms()) {
                    room.setAvailableRooms(newAvailable);
                    
                    // Nếu từ hết phòng → còn phòng, cập nhật lại trạng thái
                    if (room.getAvailableRooms() > 0 && !room.getIsAvailable()) {
                        room.setIsAvailable(true);
                        room.setAvailability("Còn trống");
                    }
                    
                    roomRepository.save(room);
                }
            }
        }

        booking.setStatus("CANCELLED");
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }

    public List<BookingResponse> getMyBookings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByTenant(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return bookingRepository.findByRoom(room).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponse(booking);
    }

    public List<BookingResponse> getLandlordPendingBookings(Long userId) {
        User landlord = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Lấy tất cả booking PENDING của các phòng mà user này sở hữu
        List<Room> landlordRooms = roomRepository.findByOwner(landlord);
        
        return bookingRepository.findAll().stream()
                .filter(booking -> landlordRooms.contains(booking.getRoom()))
                .filter(booking -> "PENDING".equals(booking.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllLandlordBookings(Long userId) {
        User landlord = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Lấy tất cả booking của các phòng mà user này sở hữu
        List<Room> landlordRooms = roomRepository.findByOwner(landlord);
        
        return bookingRepository.findAll().stream()
                .filter(booking -> landlordRooms.contains(booking.getRoom()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse rejectBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Kiểm tra quyền (chỉ chủ phòng mới có thể reject)
        if (booking.getRoom().getOwner().getId() != userId) {
            throw new RuntimeException("You don't have permission to reject this booking");
        }

        booking.setStatus("REJECTED");
        booking.setCanceledBy("LANDLORD");
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingId(booking.getBookingId())
                .roomId(booking.getRoom().getId())
                .roomName(booking.getRoom().getName())
                .tenantId(booking.getTenant().getId())
                .tenantUsername(booking.getTenant().getUsername())
                .duration(booking.getDuration())
                .durationUnit(booking.getDurationUnit())
                .moveInDate(booking.getMoveInDate())
                .numberOfPeople(booking.getNumberOfPeople())
                .phoneNumber(booking.getPhoneNumber())
                .note(booking.getNote())
                .status(booking.getStatus())
                .isDeposit(booking.getIsDeposit())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}

