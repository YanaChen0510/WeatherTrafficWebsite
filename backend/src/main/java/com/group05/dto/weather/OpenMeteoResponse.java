package com.group05.dto.weather;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenMeteoResponse {
    private HourlyWeatherDto hourly;
    private DailyWeatherDto daily;

    public HourlyWeatherDto getHourly() {
        return hourly;
    }

    public void setHourly(HourlyWeatherDto hourly) {
        this.hourly = hourly;
    }

    public DailyWeatherDto getDaily() {
        return daily;
    }

    public void setDaily(DailyWeatherDto daily) {
        this.daily = daily;
    }
}
