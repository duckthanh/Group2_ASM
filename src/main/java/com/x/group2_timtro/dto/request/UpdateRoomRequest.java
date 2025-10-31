package com.x.group2_timtro.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRoomRequest {
    private String name;
    private String imageUrl;
    private String additionalImages; // JSON array string
    private String detail;
    private Double price;
    private String location;
    private String contact;
    private Boolean isAvailable;
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
<<<<<<< HEAD
=======
    
    // Room quantity
    private Integer totalRooms;
    private Integer availableRooms;
>>>>>>> origin/phong28
}

