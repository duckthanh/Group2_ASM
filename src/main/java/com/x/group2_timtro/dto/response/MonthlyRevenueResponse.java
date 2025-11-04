package com.x.group2_timtro.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenueResponse {
    private String month;         // Format: YYYY-MM
    private Double totalRevenue;  // Total revenue of that month
}