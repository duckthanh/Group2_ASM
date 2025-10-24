package com.x.group2_timtro.dto.request;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class RoomFilterRequest {
    private List<String> roomTypes;
    private Double minPrice;
    private Double maxPrice;
    private List<String> areas;
    private List<String> amenities;
    private Integer capacity;
    private String availability;
}

