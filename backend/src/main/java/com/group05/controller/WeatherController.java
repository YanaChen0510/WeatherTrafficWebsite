package com.group05.controller;
import com.group05.dto.weather.*;
import com.group05.service.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;


@CrossOrigin(origins = "http://localhost")
@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService service;

    public WeatherController(WeatherService service) {
        this.service = service;
    }

    // localhost:8081/api/weather/archive?lat=X&lon=X&start=yyyy-MM-dd&end=yyyy-MM-dd
    // http://localhost:8081/api/weather/archive?lat=60.33&lon=24.66&start=2025-11-01&end=2025-11-10
    @GetMapping("/archive")
    public WeatherDto getWeather(
            @RequestParam("lat") double latitude,
            @RequestParam("lon") double longitude,
            @RequestParam("start") String startDate,
            @RequestParam("end") String endDate) {

        return service.getWeather(latitude, longitude, LocalDate.parse(startDate), LocalDate.parse(endDate));
    }

}
