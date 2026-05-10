package com.traveloop.backend.repositories;

import com.traveloop.backend.models.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StopRepository extends JpaRepository<Stop, Long> {
    List<Stop> findByTripIdOrderByOrderIndexAsc(Long tripId);
}
