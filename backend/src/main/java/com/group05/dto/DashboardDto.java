package com.group05.dto;

import com.group05.dto.weather.*;

public class DashboardDto {
    private long stationId;
    private String stationName;
    private String municipality;
    private Double[] coordinates; // [longitude, latitude]

    private Double avgSpeed5Min;    // km/h
    private Double avgSpeed60Min;   // km/h
    private Double avgSpeedPercent; // optional, % of free flow

    private Integer vehicleCount5Min;   // kpl/h
    private Integer vehicleCount60Min;  // kpl/h

    private CurrentWeatherDto weather;

    public long getStationId() {
        return stationId;
    }
    public void setStationId(long stationId) {
        this.stationId = stationId;
    }
    public String getStationName() {
        return stationName;
    }
    public void setStationName(String stationName) {
        this.stationName = stationName;
    }
    public String getMunicipality() {
        return municipality;
    }
    public void setMunicipality(String municipality) {
        this.municipality = municipality;
    }
    public Double[] getCoordinates() {
        return coordinates;
    }
    public void setCoordinates(Double[] coordinates) {
        this.coordinates = coordinates;
    }
    public Double getAvgSpeed5Min() {
        return avgSpeed5Min;
    }
    public void setAvgSpeed5Min(Double avgSpeed5Min) {
        this.avgSpeed5Min = avgSpeed5Min;
    }
    public Double getAvgSpeed60Min() {
        return avgSpeed60Min;
    }
    public void setAvgSpeed60Min(Double avgSpeed60Min) {
        this.avgSpeed60Min = avgSpeed60Min;
    }
    public Double getAvgSpeedPercent() {
        return avgSpeedPercent;
    }
    public void setAvgSpeedPercent(Double avgSpeedPercent) {
        this.avgSpeedPercent = avgSpeedPercent;
    }
    public Integer getVehicleCount5Min() {
        return vehicleCount5Min;
    }
    public void setVehicleCount5Min(Integer vehicleCount5Min) {
        this.vehicleCount5Min = vehicleCount5Min;
    }
    public Integer getVehicleCount60Min() {
        return vehicleCount60Min;
    }
    public void setVehicleCount60Min(Integer vehicleCount60Min) {
        this.vehicleCount60Min = vehicleCount60Min;
    }

    public CurrentWeatherDto getWeather() {
        return weather;
    }
    public void setWeather(CurrentWeatherDto weather) {
        this.weather = weather;
    }


    
}
    
