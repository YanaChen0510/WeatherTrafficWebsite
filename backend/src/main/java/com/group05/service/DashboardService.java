package com.group05.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.group05.dto.*;
import com.group05.dto.traffic.*;
import com.group05.dto.weather.*;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    TrafficService trafficService = new TrafficService();
    WeatherService weatherService = new WeatherService();

    public DashboardDto getDashboardForStation(long stationId) {
        StationDto station = trafficService.getStation(stationId);
        List<SensorDto> sensors = station.getSensors();

        DashboardDto dashboard = new DashboardDto();

        dashboard.setStationId(station.getId());
        dashboard.setStationName(station.getName());
        dashboard.setMunicipality(station.getMunicipality());
        dashboard.setCoordinates(station.getCoordinates());


        // https://www.digitraffic.fi/en/road-traffic/lam/

        // For vehicle counts in kpl/h, use 
        // 5116/5119 for 5-min, 
        // 5054/5055 for 60-min. 
        // Ignore the % max unless you want normalized values.

        //For raw average speed in km/h, use 
        // 5056, 5057 for 60-min, 
        // 5122, 5125 for 5-min.

        dashboard.setAvgSpeed5Min(getSensorValue(sensors, "KESKINOPEUS_5MIN_LIUKUVA_SUUNTA1"));
        dashboard.setAvgSpeed60Min(getSensorValue(sensors, "KESKINOPEUS_60MIN_KIINTEA_SUUNTA1"));

        dashboard.setAvgSpeedPercent(getSensorValue(sensors, "KESKINOPEUS_5MIN_LIUKUVA_SUUNTA1_VVAPAAS1"));

        dashboard.setVehicleCount5Min(getSensorValue(sensors, "OHITUKSET_5MIN_LIUKUVA_SUUNTA1").intValue());
        dashboard.setVehicleCount60Min(getSensorValue(sensors, "OHITUKSET_60MIN_KIINTEA_SUUNTA1").intValue());

        LocalDate today = LocalDate.now();
        WeatherDto weather = weatherService.getWeather(station.getCoordinates()[0], // latitude
                                        station.getCoordinates()[1], // longitude
                                        today,
                                        today);

        
        CurrentWeatherDto currentWeather = getCurrentWeather(weather);
        dashboard.setWeather(currentWeather);

        return dashboard;
    }

    private CurrentWeatherDto getCurrentWeather(WeatherDto weather) {
        CurrentWeatherDto current = new CurrentWeatherDto();

        List<LocalDateTime> times = weather.hourly.time;
        int currentHour = LocalDateTime.now().getHour();

        for (int i = 0; i < times.size(); i++) {
            LocalDateTime t = times.get(i);

            if(t.getHour() == currentHour) {

                HourlyDto hourly = weather.hourly;
                current.setTemperature(hourly.temperature_2m.get(i));
                current.setPrecipitation(hourly.precipitation.get(i));
                current.setWindSpeed(hourly.wind_speed_10m.get(i));
                current.setWindDirection(hourly.wind_direction_10m.get(i));
                current.setCloudCover(hourly.cloud_cover.get(i));
                current.setWeatherCode(hourly.weather_code.get(i));
                current.setDaylight_duration(weather.daily.getDaylight_duration().get(0));
                current.setSunrise(weather.daily.getSunrise().get(0));
                current.setSunset(weather.daily.getSunset().get(0));

                
                try (InputStream is = getClass().getClassLoader().getResourceAsStream("weather-icons.json")) {
                    if (is == null) throw new RuntimeException("weather-icons.json not found");

                    JsonNode root = new ObjectMapper().readTree(is);

                    String code = String.valueOf(current.getWeatherCode());

                    LocalDateTime currentTime = LocalDateTime.now();
                    
                    String time = (currentTime.isAfter(current.getSunrise()) && currentTime.isBefore(current.getSunset())) ? "day" : "night";

                    String description = root.path(code).path(time).path("description").asText("Unknown");
                    String imageUrl = root.path(code).path(time).path("image").asText(
                            "https://raw.githubusercontent.com/roe-dl/weathericons/821f079defd57651e9c4d0ccedb5450c9a9ca7ee/weathericons-filled/unknown.svg"
                    );
                
                    current.setDescription(description);
                    current.setIconUrl(imageUrl);
                
                } catch(Exception e) {
                    System.out.println("An exception occurred: " + e.getMessage());
                    current.setDescription("Error getting description");
                    current.setIconUrl("https://raw.githubusercontent.com/roe-dl/weathericons/821f079defd57651e9c4d0ccedb5450c9a9ca7ee/weathericons-filled/unknown.svg");
                }

                return current;
            }
        }

        return null;
    }

    private Double getSensorValue(List<SensorDto> sensors, String property) {
        return sensors.stream()
            .filter(s -> s.getName().equals(property))
            .findFirst().orElse(null).getValue();
    }

    public HourlyWeatherDto getHistoricalWeather(long id, int days) {

        StationDto station = trafficService.getStation(id);
        Double[] coords = station.getCoordinates();

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);

        return weatherService.getHistoricalWeather(coords[0], coords[1], startDate, endDate);
    }


   public SummaryDto getSummary(long id, LocalDate startDate, LocalDate endDate) {
        StationDto station = trafficService.getStation(id);

        TrafficBundleDto traffic = 
                trafficService.getDailyTrafficFromCsv(station.getTmsNumber(), startDate, endDate);

        Map<LocalDate, Integer> vehicleCounts = traffic.getVehicleCounts();
        Map<LocalDate, Double> avgSpeeds = traffic.getAvgSpeeds();


        Double[] coords = station.getCoordinates();
        DailyWeatherDto weather = weatherService.getDailyHistoricalWeather(coords[0], coords[1], startDate, endDate);

        Map<LocalDate, Double> rain = new HashMap<>();
        Map<LocalDate, Double> temperature = new HashMap<>();

        if (weather != null) {
            List<String> dates = weather.getTime();
            List<Double> rainValues = weather.getRain_sum();
            List<Double> temps = weather.getTemperature_2m_mean();

            for (int i = 0; i < dates.size(); i++) {
                LocalDate date = LocalDate.parse(dates.get(i));

                rain.put(date, rainValues.get(i));
                temperature.put(date, temps.get(i));
            }
        }

        SummaryDto summary = new SummaryDto();
        List<SummaryDto.DailySummary> days = new ArrayList<>();

        LocalDate date = startDate;
        while (!date.isAfter(endDate)) {

            SummaryDto.DailySummary day = new SummaryDto.DailySummary();
            day.setDate(date);

            day.setVehicleCount(vehicleCounts.get(date));
            day.setAvgSpeed(avgSpeeds.get(date));
            day.setRain(rain.get(date));
            day.setTemperature(temperature.get(date));

            days.add(day);
            date = date.plusDays(1);
        }

        summary.setDays(days);
        return summary;
    }
    
}


