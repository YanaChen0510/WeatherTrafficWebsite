package com.group05.controller;

import com.group05.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import com.group05.dto.*;
import com.group05.dto.weather.HourlyWeatherDto;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    // localhost:8081/api/dashboard/{id}
    @GetMapping("/{stationId}")
    public DashboardDto getStationDashboardInfo(@PathVariable(name = "stationId") long id) {
        return service.getDashboardForStation(id);
    }

    // localhost:8081/api/dashboard/{stationId}/weather-history?days=x
    @GetMapping("/{stationId}/weather-history") 
    public HourlyWeatherDto getHistoricalWeather(@PathVariable(name = "stationId") long id, 
                                                 @RequestParam(name = "days") int days) {
        return service.getHistoricalWeather(id, days);
    }

    // localhost:8081/api/dashboard/{stationId}/summary?start=yyyy-MM-dd&end=yyyy-MM-dd
    @GetMapping("/{stationId}/summary")
    public SummaryDto getSummary(@PathVariable(name = "stationId") long id,
                                 @RequestParam(name = "start") LocalDate start,
                                 @RequestParam(name = "end") LocalDate end) {
        
        return service.getSummary(id, start, end);

    }

}
