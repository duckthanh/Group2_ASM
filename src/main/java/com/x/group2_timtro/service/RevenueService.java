package com.x.group2_timtro.service;

import com.x.group2_timtro.dto.response.DailyRevenueResponse;
import com.x.group2_timtro.dto.response.MonthlyRevenueResponse;
import com.x.group2_timtro.entity.Payment;
import com.x.group2_timtro.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RevenueService {
    private final PaymentRepository paymentRepository;

    public List<String> getAvailableMonths() {
        return paymentRepository.findDistinctMonths();
    }

    public List<DailyRevenueResponse> getDailyRevenueByMonth(String month) {
        List<Object[]> rows = paymentRepository.findDailyRevenueByMonthNative(month);
        List<DailyRevenueResponse> result = new ArrayList<>();

        for (Object[] row : rows) {
            int day = ((Number) row[0]).intValue();
            double totalRevenue = ((Number) row[1]).doubleValue();
            result.add(new DailyRevenueResponse(day, totalRevenue));
        }

        return result;
    }
}