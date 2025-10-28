package com.x.group2_timtro.repository;

import com.x.group2_timtro.entity.SavedRoom;
import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedRoomRepository extends JpaRepository<SavedRoom, Long> {
    List<SavedRoom> findByUserOrderBySavedAtDesc(User user);
    Optional<SavedRoom> findByUserAndRoom(User user, Room room);
    boolean existsByUserAndRoom(User user, Room room);
    void deleteByUserAndRoom(User user, Room room);
}

