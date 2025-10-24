package com.x.group2_timtro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedRoomResponse {
    private Long id;
    private Long roomId;
    private Long userId;
    private RoomResponse room;
    private LocalDateTime savedAt;
}

