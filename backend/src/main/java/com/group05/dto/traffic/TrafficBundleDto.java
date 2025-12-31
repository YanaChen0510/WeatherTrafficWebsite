package com.group05.dto.traffic;

import java.util.HashMap;
import java.util.Map;
import java.time.LocalDate;

public class TrafficBundleDto {
    private Map<LocalDate, Integer> vehicleCounts;
    private Map<LocalDate, Double> avgSpeeds;

    public TrafficBundleDto() {
        this.vehicleCounts = new HashMap<>();
        this.avgSpeeds = new HashMap<>();
    }

    public TrafficBundleDto(Map<LocalDate, Integer> counts, Map<LocalDate, Double> speeds) {
        this.vehicleCounts = counts;
        this.avgSpeeds = speeds;
    }

    public Map<LocalDate, Integer> getVehicleCounts() {
        return vehicleCounts;
    }

    public void setVehicleCounts(Map<LocalDate, Integer> vehicleCounts) {
        this.vehicleCounts = vehicleCounts;
    }

    public Map<LocalDate, Double> getAvgSpeeds() {
        return avgSpeeds;
    }

    public void setAvgSpeeds(Map<LocalDate, Double> avgSpeeds) {
        this.avgSpeeds = avgSpeeds;
    }
}
