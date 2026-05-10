package com.traveloop.backend.services;

import com.traveloop.backend.models.Activity;
import com.traveloop.backend.models.Stop;
import com.traveloop.backend.models.Trip;
import com.traveloop.backend.repositories.ActivityRepository;
import com.traveloop.backend.repositories.StopRepository;
import com.traveloop.backend.repositories.TripRepository;
import com.traveloop.backend.repositories.UserRepository;
import com.traveloop.backend.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private StopRepository stopRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Trip> getAllTripsForUser(Long userId) {
        return tripRepository.findByUserId(userId);
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));
    }

    public Trip createTrip(Trip trip, Long userId) {
        com.traveloop.backend.models.User user = userRepository.findById(userId).orElseGet(() -> {
            com.traveloop.backend.models.User newUser = new com.traveloop.backend.models.User();
            newUser.setName("Alex Traveler");
            newUser.setEmail("alex@example.com");
            return userRepository.save(newUser);
        });
        trip.setUser(user);
        return tripRepository.save(trip);
    }

    public Stop addStopToTrip(Long tripId, Stop stop) {
        Trip trip = getTripById(tripId);
        stop.setTrip(trip);
        return stopRepository.save(stop);
    }

    public Stop updateStop(Long stopId, Stop updatedStop) {
        Stop existing = stopRepository.findById(stopId).orElseThrow(() -> new ResourceNotFoundException("Stop not found with id: " + stopId));
        existing.setCityName(updatedStop.getCityName());
        existing.setStartDate(updatedStop.getStartDate());
        existing.setEndDate(updatedStop.getEndDate());
        existing.setBudgetAllocated(updatedStop.getBudgetAllocated());
        existing.setOrderIndex(updatedStop.getOrderIndex());
        return stopRepository.save(existing);
    }

    public Activity addActivityToStop(Long stopId, Activity activity) {
        Stop stop = stopRepository.findById(stopId).orElseThrow(() -> new ResourceNotFoundException("Stop not found with id: " + stopId));
        activity.setStop(stop);
        return activityRepository.save(activity);
    }

    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }

    public void deleteStop(Long id) {
        stopRepository.deleteById(id);
    }

    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }

    public Trip updateTrip(Long id, Trip updatedTrip) {
        Trip existing = getTripById(id);
        existing.setName(updatedTrip.getName());
        existing.setDescription(updatedTrip.getDescription());
        existing.setStartDate(updatedTrip.getStartDate());
        existing.setEndDate(updatedTrip.getEndDate());
        existing.setCoverImage(updatedTrip.getCoverImage());
        existing.setStatus(updatedTrip.getStatus());
        existing.setPublic(updatedTrip.isPublic());
        return tripRepository.save(existing);
    }

    // --- Utility Methods ---

    @Autowired
    private com.traveloop.backend.repositories.ChecklistItemRepository checklistItemRepository;

    @Autowired
    private com.traveloop.backend.repositories.NoteRepository noteRepository;

    public List<com.traveloop.backend.models.ChecklistItem> getChecklistForTrip(Long tripId) {
        return checklistItemRepository.findByTripId(tripId);
    }

    public com.traveloop.backend.models.ChecklistItem addChecklistItem(Long tripId, com.traveloop.backend.models.ChecklistItem item) {
        Trip trip = getTripById(tripId);
        item.setTrip(trip);
        return checklistItemRepository.save(item);
    }

    public com.traveloop.backend.models.ChecklistItem toggleChecklistItem(Long itemId) {
        com.traveloop.backend.models.ChecklistItem item = checklistItemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Checklist item not found with id: " + itemId));
        item.setPacked(!item.isPacked());
        return checklistItemRepository.save(item);
    }

    public void deleteChecklistItem(Long itemId) {
        checklistItemRepository.deleteById(itemId);
    }

    public List<com.traveloop.backend.models.Note> getNotesForTrip(Long tripId) {
        return noteRepository.findByTripIdOrderByCreatedAtDesc(tripId);
    }

    public com.traveloop.backend.models.Note addNote(Long tripId, com.traveloop.backend.models.Note note) {
        Trip trip = getTripById(tripId);
        note.setTrip(trip);
        return noteRepository.save(note);
    }
}
