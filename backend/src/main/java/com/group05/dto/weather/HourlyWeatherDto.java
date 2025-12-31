package com.group05.dto.weather;

import java.util.List;
import java.time.LocalDateTime;

public class HourlyWeatherDto {
    private List<LocalDateTime> time;
    private List<Double> temperature_2m;
    private List<Integer> weather_code;

    public List<LocalDateTime> getTime() {
        return time;
    }

    public void setTime(List<LocalDateTime> time) {
        this.time = time;
    }

    public List<Double> getTemperature_2m() {
        return temperature_2m;
    }

    public void setTemperature_2m(List<Double> temperature_2m) {
        this.temperature_2m = temperature_2m;
    }

    public List<Integer> getWeather_code() {
        return weather_code;
    }

    public void setWeather_code(List<Integer> weather_code) {
        this.weather_code = weather_code;
    }
}