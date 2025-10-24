package com.x.group2_timtro.repository;

import com.x.group2_timtro.entity.Booking;
import com.x.group2_timtro.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByBooking(Booking booking);
    List<Issue> findByBookingOrderByCreatedAtDesc(Booking booking);
    List<Issue> findByStatus(String status);
}

