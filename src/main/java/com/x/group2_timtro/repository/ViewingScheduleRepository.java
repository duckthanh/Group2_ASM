package com.x.group2_timtro.repository;

import com.x.group2_timtro.entity.ViewingSchedule;
import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ViewingScheduleRepository extends JpaRepository<ViewingSchedule, Long> {
    List<ViewingSchedule> findByUserOrderByViewingDateDesc(User user);
    List<ViewingSchedule> findByRoomOrderByViewingDateDesc(Room room);
    List<ViewingSchedule> findByRoomAndViewingDate(Room room, LocalDate viewingDate);
    List<ViewingSchedule> findByStatusOrderByViewingDateDesc(String status);
}

