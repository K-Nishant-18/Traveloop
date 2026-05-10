package com.traveloop.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "checklist_items")
public class ChecklistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "stops", "user"})
    private Trip trip;

    // e.g., Documents, Electronics, Clothing
    private String category;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "is_packed")
    private boolean isPacked = false;
}
