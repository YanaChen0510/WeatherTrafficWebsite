package com.group05.dto;

import java.time.LocalDate;
import java.util.List;

public class SummaryDto {

    private List<DailySummary> days;   // ⬅ contains all data merged per day

    public List<DailySummary> getDays() {
        return days;
    }

    public void setDays(List<DailySummary> days) {
        this.days = days;
    }

    

    public static class DailySummary {
        private LocalDate date;
        private Double avgSpeed;
        private Integer vehicleCount;
        private Double rain;
        private Double temperature;

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public Double getAvgSpeed() {
            return avgSpeed;
        }

        public void setAvgSpeed(Double avgSpeed) {
            this.avgSpeed = avgSpeed;
        }

        public Integer getVehicleCount() {
            return vehicleCount;
        }

        public void setVehicleCount(Integer vehicleCount) {
            this.vehicleCount = vehicleCount;
        }

        public Double getRain() {
            return rain;
        }

        public void setRain(Double rain) {
            this.rain = rain;
        }

        public Double getTemperature() {
            return temperature;
        }

        public void setTemperature(Double temperature) {
            this.temperature = temperature;
        }
    }
}

