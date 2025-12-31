package com.group05.controller;

import com.group05.service.TrafficService;
import com.group05.service.CameraService;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import com.group05.dto.traffic.*;

@RestController
@RequestMapping("api/traffic")
public class TrafficController {

    private final TrafficService service;
    private final CameraService cService;

    public TrafficController(TrafficService service, CameraService cService) {
        this.service = service;
        this.cService = cService;
    }

    // localhost:8081/api/traffic/stations
    @GetMapping("/stations")
    public List<StationBaseDto> getAllStations() {
        return service.getAllStationIds();
    }

    // localhost:8081/api/traffic/stations/{id}
    @GetMapping("/stations/{id}")
    public StationDto getStation(@PathVariable(name = "id") long id) {
        return service.getStation(id);
    }

    // list of all coordinates
    // localhost:8081/api/traffic/stations/coordinates
    @GetMapping("/stations/coordinates")
    public List<Double[]> getStationsBase() {

        List<StationBaseDto> stations = service.getAllStationIds();
        return stations.stream()
        .map(StationBaseDto::getCoordinates)
        .toList();

    }

    // localhost:8081/api/traffic/weathercam/stations
    @GetMapping("/weathercam/stations")
    public List<WeatherCameraDto> getAllWeathercamStations() {
        return cService.getAllCameraStations();
    }

    // localhost:8081/api/traffic/weathercam/stations/{id}
    @GetMapping("weathercam/stations/{id}")
    public WeatherCameraDto getWeatherCamera(@PathVariable(name = "id") String id) {
        return cService.getWeatherCamera(id);
    }

    // localhost:8081/api/traffic/stations/{id}/history?start=yyyy-MM-dd&end=yyyy-MM-dd
    @GetMapping("/stations/{id}/history")
    public TrafficHistoryDto getTrafficHistory(
            @PathVariable(name = "id") long id,
            @RequestParam("start") LocalDate start,
            @RequestParam("end") LocalDate end) {

        return service.getHistoricalTraffic(id, start, end);
    }

}
