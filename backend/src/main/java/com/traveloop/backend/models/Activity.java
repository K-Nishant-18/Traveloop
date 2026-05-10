package com.traveloop.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;

@Entity
@Data
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stop_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "activities", "trip"})
    private Stop stop;

    @Column(nullable = false)
    private String title;

    // e.g. FOOD, SIGHTSEEING, TRANSIT, ACCOMMODATION, OTHER
    private String type;

    private Double cost;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "duration_hours")
    private Double durationHours;
}
