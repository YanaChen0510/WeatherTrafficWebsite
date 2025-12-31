package com.group05.service;
import com.group05.dto.weather.*;

import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "https://archive-api.open-meteo.com/v1/archive";


    public WeatherDto getWeather(double latitude,
                                      double longitude,
                                      LocalDate startDate,
                                      LocalDate endDate) {

        String url = BASE_URL
                + "?latitude=" + latitude
                + "&longitude=" + longitude
                + "&start_date=" + startDate
                + "&end_date=" + endDate
                + "&daily=daylight_duration,sunrise,sunset"
                + "&hourly=temperature_2m,precipitation,rain,snowfall,cloud_cover,weather_code,wind_speed_10m,wind_direction_10m";

        return restTemplate.getForObject(url, WeatherDto.class);
    }


    public HourlyWeatherDto getHistoricalWeather(double latitude, double longitude, LocalDate startDate, LocalDate endDate) {

        String url = BASE_URL
        + "?latitude=" + latitude
        + "&longitude=" + longitude
        + "&start_date=" + startDate
        + "&end_date=" + endDate
        + "&hourly=temperature_2m,weather_code";

        OpenMeteoResponse response = restTemplate.getForObject(url, OpenMeteoResponse.class);

        return response != null ? response.getHourly() : null;
    }

    public DailyWeatherDto getDailyHistoricalWeather(double latitude, double longitude, LocalDate startDate, LocalDate endDate) {
                String url = BASE_URL
        + "?latitude=" + latitude
        + "&longitude=" + longitude
        + "&start_date=" + startDate
        + "&end_date=" + endDate
        + "&daily=rain_sum,temperature_2m_mean";

        OpenMeteoResponse response = restTemplate.getForObject(url, OpenMeteoResponse.class);

        return response != null ? response.getDaily() : null;
    }

}
