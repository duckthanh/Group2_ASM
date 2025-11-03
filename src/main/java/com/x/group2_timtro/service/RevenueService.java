package com.x.group2_timtro.service;

import com.x.group2_timtro.dto.response.MonthlyRevenueResponse;
import com.x.group2_timtro.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RevenueService {

    private final PaymentRepository paymentRepository;

    public List<MonthlyRevenueResponse> getMonthlyRevenue() {
        List<Object[]> results = paymentRepository.getMonthlyRevenueRaw();

        return results.stream()
                .map(row -> new MonthlyRevenueResponse(
                        (String) row[0],
                        ((Number) row[1]).doubleValue()
                ))
                .toList();
    }
}
