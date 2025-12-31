package com.group05.dto.weather;

public class WeatherDto {
    public double latitude;
    public double longitude;
    public double generationtime_ms;
    public int utc_offset_seconds;
    public String timezone;
    public String timezone_abbreviation;
    public double elevation;

    public HourlyUnitsDto hourly_units;
    public HourlyDto hourly;

    public DailyUnitsDto daily_units;
    public DailyDto daily;
}