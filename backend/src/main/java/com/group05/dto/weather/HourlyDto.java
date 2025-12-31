package com.group05.dto.weather;

import java.time.LocalDateTime;
import java.util.List;

public class HourlyDto {
    public List<LocalDateTime> time;
    public List<Double> temperature_2m;
    public List<Double> precipitation;
    public List<Double> rain;
    public List<Double> snowfall;
    public List<Integer> cloud_cover;
    public List<Integer> weather_code;
    public List<Double> wind_speed_10m;
    public List<Integer> wind_direction_10m;
}