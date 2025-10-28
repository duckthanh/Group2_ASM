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
public class RoomReportResponse {
    private Long id;
    private Long roomId;
    private Long reporterId;
    private String reporterName;
    private String reason;
    private String description;
    private String status;
    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;
}

