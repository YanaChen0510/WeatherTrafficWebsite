package com.group05.dto.weather;

import java.time.LocalDateTime;

public class CurrentWeatherDto {
    private Double temperature;
    private Double precipitation;
    private Double windSpeed;
    private int windDirection;
    private int cloudCover;
    private int weatherCode;

    private Double daylight_duration;
    private LocalDateTime sunrise;
    private LocalDateTime sunset;

    private String description;
    private String iconUrl;


    public double getTemperature() {
        return temperature;
    }
    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
    public Double getPrecipitation() {
        return precipitation;
    }
    public void setPrecipitation(Double precipitation) {
        this.precipitation = precipitation;
    }
    public Double getWindSpeed() {
        return windSpeed;
    }
    public void setWindSpeed(Double windSpeed) {
        this.windSpeed = windSpeed;
    }
    public int getWindDirection() {
        return windDirection;
    }
    public void setWindDirection(int windDirection) {
        this.windDirection = windDirection;
    }
    public int getCloudCover() {
        return cloudCover;
    }
    public void setCloudCover(int cloudCover) {
        this.cloudCover = cloudCover;
    }
    public int getWeatherCode() {
        return weatherCode;
    }
    public void setWeatherCode(int weatherCode) {
        this.weatherCode = weatherCode;
    }
    public Double getDaylight_duration() {
        return daylight_duration;
    }
    public void setDaylight_duration(Double daylight_duration) {
        this.daylight_duration = daylight_duration;
    }
    public LocalDateTime getSunrise() {
        return sunrise;
    }
    public void setSunrise(LocalDateTime sunrise) {
        this.sunrise = sunrise;
    }
    public LocalDateTime getSunset() {
        return sunset;
    }
    public void setSunset(LocalDateTime sunset) {
        this.sunset = sunset;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getIconUrl() {
        return iconUrl;
    }
    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }
    
}

