package com.x.group2_timtro.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MyPostedRoomResponse {
    private Long id;
    private String name;
    private String imageUrl;
    private String location;
    private Double price;
    private Double area;
    private Integer capacity;
    private Boolean isAvailable;
    private String roomType;
    
    // Statistics
    private Integer totalBookings;      // Tổng số booking
    private Integer activeBookings;     // Số người đang thuê
    private Integer pendingBookings;    // Số yêu cầu chờ xác nhận
    
    // Dates
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

