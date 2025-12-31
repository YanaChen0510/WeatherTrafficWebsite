package com.group05.dto.traffic;

import java.util.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class StationDto {

    private String dataUpdatedTime;
    private long id;
    private int tmsNumber;
    private String name;
    private String municipality;
    private Double[] coordinates = new Double[2];
    private List<SensorDto> sensors;

    private List<WeatherCameraDto> weatherCameras;


    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
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
    public List<SensorDto> getSensors() {
        return sensors;
    }
    public void setSensors(List<SensorDto> sensors) {
        this.sensors = sensors;
    }
    public String getDataUpdatedTime() {
        return dataUpdatedTime;
    }
    public void setDataUpdatedTime(String dataUpdatedTime) {
        this.dataUpdatedTime = dataUpdatedTime;
    }

    public int getTmsNumber() {
        return tmsNumber;
    }

    public void setTmsNumber(int tmsNumber) {
        this.tmsNumber = tmsNumber;
    }

    public List<WeatherCameraDto> getWeatherCameras() {
        return weatherCameras;
    }

    public void setWeatherCameras(List<WeatherCameraDto> weatherCameras) {
        this.weatherCameras = weatherCameras;
    }
}
