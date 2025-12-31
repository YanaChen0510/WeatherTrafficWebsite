package com.group05.dto.weather;

import java.time.LocalDateTime;
import java.util.List;

public class DailyDto {
    private List<String> time;
    private List<Double> daylight_duration;
    private List<LocalDateTime> sunrise;
    private List<LocalDateTime> sunset;

    public List<String> getTime() {
        return time;
    }
    public void setTime(List<String> time) {
        this.time = time;
    }
    public List<Double> getDaylight_duration() {
        return daylight_duration;
    }
    public void setDaylight_duration(List<Double> daylight_duration) {
        this.daylight_duration = daylight_duration;
    }
    public List<LocalDateTime> getSunrise() {
        return sunrise;
    }
    public void setSunrise(List<LocalDateTime> sunrise) {
        this.sunrise = sunrise;
    }
    public List<LocalDateTime> getSunset() {
        return sunset;
    }
    public void setSunset(List<LocalDateTime> sunset) {
        this.sunset = sunset;
    }
}
