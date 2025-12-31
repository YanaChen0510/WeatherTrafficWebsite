package com.group05.dto.weather;

import java.util.List;

public class DailyWeatherDto {
    private List<String> time;
    private List<Double> rain_sum;
    private List<Double> temperature_2m_mean;

    public List<String> getTime() { return time; }
    public List<Double> getRain_sum() { return rain_sum; }
    public List<Double> getTemperature_2m_mean() { return temperature_2m_mean; }

    public void setTime(List<String> time) { this.time = time; }
    public void setRain_sum(List<Double> rain_sum) { this.rain_sum = rain_sum; }
    public void setTemperature_2m_mean(List<Double> temperature_2m_mean) {
        this.temperature_2m_mean = temperature_2m_mean;
    }
}
