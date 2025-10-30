package com.x.group2_timtro.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class RoomResponse {
    private Long id;
    private String name;
    private String imageUrl;
    private String additionalImages; // JSON array string
    private String detail;
    private Double price;
    private String location;
    private String contact;
    private Boolean isAvailable;
    private Long ownerId;
    private String ownerUsername;
    private String ownerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Filter fields
    private String roomType;
    private Double area;
    private Integer capacity;
    private String amenities;
    private String availability;
    
    // Cost fields
    private Double electricityCost;
    private Double waterCost;
    private Double internetCost;
    private Double parkingFee;
    private Double deposit;
    private String depositType;
    
    // Room quantity
    private Integer totalRooms;
    private Integer availableRooms;
}

