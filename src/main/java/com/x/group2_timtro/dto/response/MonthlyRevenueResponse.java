package com.x.group2_timtro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class MonthlyRevenueResponse {
    private String month;
    private Double totalRevenue;

    public MonthlyRevenueResponse(String month, Double totalRevenue) {
        this.month = month;
        this.totalRevenue = totalRevenue;
    }

    public MonthlyRevenueResponse() {}

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
