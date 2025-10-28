package com.x.group2_timtro.repository;

import com.x.group2_timtro.entity.RoomReport;
import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomReportRepository extends JpaRepository<RoomReport, Long> {
    List<RoomReport> findByRoomOrderByReportedAtDesc(Room room);
    List<RoomReport> findByReporterOrderByReportedAtDesc(User reporter);
    List<RoomReport> findByStatusOrderByReportedAtDesc(String status);
    List<RoomReport> findAllByOrderByReportedAtDesc();
}

