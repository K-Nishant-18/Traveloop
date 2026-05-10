package com.traveloop.backend.controllers;

import com.traveloop.backend.models.Activity;
import com.traveloop.backend.models.Stop;
import com.traveloop.backend.models.Trip;
import com.traveloop.backend.services.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*") // For hackathon purposes
public class TripController {

    @Autowired
    private TripService tripService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Trip>> getUserTrips(@PathVariable Long userId) {
        return ResponseEntity.ok(tripService.getAllTripsForUser(userId));
    }

    @GetMapping("/public")
    public ResponseEntity<List<Trip>> getPublicTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip, @PathVariable Long userId) {
        return ResponseEntity.ok(tripService.createTrip(trip, userId));
    }

    @PostMapping("/{tripId}/stops")
    public ResponseEntity<Stop> addStop(@PathVariable Long tripId, @RequestBody Stop stop) {
        return ResponseEntity.ok(tripService.addStopToTrip(tripId, stop));
    }

    @PutMapping("/stops/{stopId}")
    public ResponseEntity<Stop> updateStop(@PathVariable Long stopId, @RequestBody Stop stop) {
        return ResponseEntity.ok(tripService.updateStop(stopId, stop));
    }

    @PostMapping("/stops/{stopId}/activities")
    public ResponseEntity<Activity> addActivity(@PathVariable Long stopId, @RequestBody Activity activity) {
        return ResponseEntity.ok(tripService.addActivityToStop(stopId, activity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/stops/{stopId}")
    public ResponseEntity<?> deleteStop(@PathVariable Long stopId) {
        tripService.deleteStop(stopId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/activities/{activityId}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long activityId) {
        tripService.deleteActivity(activityId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @RequestBody Trip trip) {
        return ResponseEntity.ok(tripService.updateTrip(id, trip));
    }

    // --- Utility Endpoints ---

    @GetMapping("/{tripId}/checklist")
    public ResponseEntity<List<com.traveloop.backend.models.ChecklistItem>> getChecklist(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.getChecklistForTrip(tripId));
    }

    @PostMapping("/{tripId}/checklist")
    public ResponseEntity<com.traveloop.backend.models.ChecklistItem> addChecklistItem(@PathVariable Long tripId, @RequestBody com.traveloop.backend.models.ChecklistItem item) {
        return ResponseEntity.ok(tripService.addChecklistItem(tripId, item));
    }

    @PutMapping("/checklist/{itemId}/toggle")
    public ResponseEntity<com.traveloop.backend.models.ChecklistItem> toggleChecklistItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(tripService.toggleChecklistItem(itemId));
    }

    @DeleteMapping("/checklist/{itemId}")
    public ResponseEntity<?> deleteChecklistItem(@PathVariable Long itemId) {
        tripService.deleteChecklistItem(itemId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{tripId}/notes")
    public ResponseEntity<List<com.traveloop.backend.models.Note>> getNotes(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.getNotesForTrip(tripId));
    }

    @PostMapping("/{tripId}/notes")
    public ResponseEntity<com.traveloop.backend.models.Note> addNote(@PathVariable Long tripId, @RequestBody com.traveloop.backend.models.Note note) {
        return ResponseEntity.ok(tripService.addNote(tripId, note));
    }
}
