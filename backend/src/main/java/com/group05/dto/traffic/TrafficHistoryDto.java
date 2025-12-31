package com.group05.dto.traffic;

import java.time.LocalDate;
import java.util.Map;

public class TrafficHistoryDto {

    private Map<LocalDate, Integer> vehicleCount;
    private Map<LocalDate, Double> averageSpeed;

    public TrafficHistoryDto() {}

    public TrafficHistoryDto(Map<LocalDate, Integer> vehicleCount,
                             Map<LocalDate, Double> averageSpeed) {
        this.vehicleCount = vehicleCount;
        this.averageSpeed = averageSpeed;
    }

    public Map<LocalDate, Integer> getVehicleCount() {
        return vehicleCount;
    }

    public void setVehicleCount(Map<LocalDate, Integer> vehicleCount) {
        this.vehicleCount = vehicleCount;
    }

    public Map<LocalDate, Double> getAverageSpeed() {
        return averageSpeed;
    }

    public void setAverageSpeed(Map<LocalDate, Double> averageSpeed) {
        this.averageSpeed = averageSpeed;
    }
}
