package com.x.group2_timtro.service;

import com.x.group2_timtro.dto.response.DailyRevenueResponse;
import com.x.group2_timtro.repository.PaymentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RevenueServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private RevenueService revenueService;

    @Test
    void getDailyRevenueByMonth_ShouldMapRowsCorrectly() {
        String month = "2025-11";
        List<Object[]> mockRows = Arrays.asList(
                new Object[]{1, 150.0},
                new Object[]{2, 300.5},
                new Object[]{3, 0.0}
        );
        when(paymentRepository.findDailyRevenueByMonthNative(month)).thenReturn(mockRows);
        List<DailyRevenueResponse> result = revenueService.getDailyRevenueByMonth(month);
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(1, result.get(0).getDay());
        assertEquals(150.0, result.get(0).getTotalRevenue());
        assertEquals(2, result.get(1).getDay());
        assertEquals(300.5, result.get(1).getTotalRevenue());
        assertEquals(3, result.get(2).getDay());
        assertEquals(0.0, result.get(2).getTotalRevenue());
        verify(paymentRepository, times(1)).findDailyRevenueByMonthNative(month);
    }

    @Test
    void getDailyRevenueByMonth_ShouldReturnEmptyList_WhenNoData() {
        String month = "2025-11";
        when(paymentRepository.findDailyRevenueByMonthNative(month)).thenReturn(Collections.emptyList());
        List<DailyRevenueResponse> result = revenueService.getDailyRevenueByMonth(month);
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(paymentRepository, times(1)).findDailyRevenueByMonthNative(month);
    }
}
