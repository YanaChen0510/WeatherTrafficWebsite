package com.group05.service;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.GZIPInputStream;

import com.group05.dto.traffic.*;
import com.fasterxml.jackson.databind.JsonNode;

// // Swagger documentation for Digitraffic
// // https://tie.digitraffic.fi/swagger/#/Weathercam%20V1/getWeathercamsPresetsHistory


import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

@Service
public class TrafficService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "https://tie.digitraffic.fi/api/tms/v1";
    private final ObjectMapper mapper = new ObjectMapper();
    private final CameraService cameraService = new CameraService();


    // RETURNS THE LIST OF ALL STATIONS
    public List<StationBaseDto> getAllStationIds() {
        try {
            String json = getResponseJSON("/stations");

            JsonNode root = mapper.readTree(json);
            JsonNode features = root.get("features");

            if (features == null || !features.isArray()) return new ArrayList<>();

            List<StationBaseDto> stations = new ArrayList<>();
            for (JsonNode feature : features) {
                JsonNode properties = feature.get("properties");
                long id = properties.get("id").asLong();

                String rawName = properties.get("name").asText();
                String name = rawName.replaceAll("^\"|\"$", "");

                JsonNode coords = feature.get("geometry").get("coordinates");

                List<Double> coordinates = new ArrayList<>();
                coordinates.add(coords.get(1).asDouble());
                coordinates.add(coords.get(0).asDouble());

                StationBaseDto station = new StationBaseDto(id, name, coordinates);
                stations.addLast(station);
            }

            return stations;

        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Returns the station info based on its ID
    public StationDto getStation(long id) {
        try {
            String json = getResponseJSON("/stations/" + id);
            JsonNode root = mapper.readTree(json);

            JsonNode properties = root.get("properties");
            JsonNode geometry = root.get("geometry");

            StationDto station = new StationDto();
            station.setId(properties.get("id").asLong());
            station.setTmsNumber(properties.get("tmsNumber").asInt());
            
            String rawName = properties.get("name").asText();
            String name = rawName.replaceAll("^\"|\"$", "");
            station.setName(name);

            station.setMunicipality(properties.get("municipality").asText());

            JsonNode coords = geometry.get("coordinates");
            Double[] coordArr = new Double[] {
                coords.get(1).asDouble(), 
                coords.get(0).asDouble()   
            };
            station.setCoordinates(coordArr);

            List<SensorDto> sensors = getStationSensors(id);
            station.setSensors(sensors);

            List<WeatherCameraDto> cameras = cameraService.getAllCameraStations();

            List<WeatherCameraDto> weatherCameras = findNearestCameras(coordArr[0], coordArr[1], cameras);
            station.setWeatherCameras(weatherCameras);

            return station;

        } catch(Exception e) {
            System.out.println("Error parsing station detail: " + e.getMessage());
            return null;
        }
    }

    private List<WeatherCameraDto> findNearestCameras(double lat, double lon, List<WeatherCameraDto> cameras) {
        return cameras.stream()
            .sorted(Comparator.comparingDouble(
                    cam -> haversine(lat, lon, cam.getLatitude(), cam.getLongitude())
            ))
            .limit(5)
            .collect(Collectors.toList());
    }

    public static double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }


    // Returns the list of sensors of a station
    private List<SensorDto> getStationSensors(long stationId) throws Exception {
        String json = getResponseJSON("/stations/" + stationId + "/data");

        JsonNode root = mapper.readTree(json);
        JsonNode sensorValues = root.get("sensorValues");

        if (sensorValues == null || !sensorValues.isArray()) return Collections.emptyList();

        List<SensorDto> sensors = new ArrayList<>();
        for (JsonNode sensorNode : sensorValues) {
            long id = sensorNode.get("id").asLong();
            String name = sensorNode.get("name").asText();
            String unit = sensorNode.get("unit").asText();
            double value = sensorNode.get("value").asDouble();

            SensorDto sensor = new SensorDto();
            sensor.setId(id);
            sensor.setName(name);
            sensor.setUnit(unit);
            sensor.setValue(value);

            sensors.add(sensor);
        }
        return sensors;
    }

    public int getTMSNumber(long id) {
        try {
            String json = getResponseJSON("/stations/" + id);
            return mapper.readTree(json).get("properties").get("tmsNumber").asInt();
        } catch (Exception e) {
            return -1;
        }
    }

    


    private String getResponseJSON(String endpoint) throws Exception {

            String url = BASE_URL + endpoint;
            HttpHeaders headers = new HttpHeaders();
            headers.add("Accept-Encoding", "gzip");
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    byte[].class
            );

            GZIPInputStream gis = new GZIPInputStream(new ByteArrayInputStream(response.getBody()));
            String json = new String(gis.readAllBytes(), StandardCharsets.UTF_8);
            return json;
    }

    private String getCSVResponse(String endpoint) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Accept-Encoding", "text/csv");
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<byte[]> response = restTemplate.exchange(
            endpoint,
            HttpMethod.GET,
            entity,
            byte[].class
        );

        byte[] csvBytes = response.getBody();
        String csv = new String(csvBytes, StandardCharsets.UTF_8);
        return csv;
    }


    public TrafficBundleDto getDailyTrafficFromCsv(long tmsId, LocalDate start, LocalDate end) {

        String url = String.format(
                "https://tie.digitraffic.fi/api/tms/v1/history?api=keskinopeus" +
                "&tyyppi=vrk&pvm=%s&loppu=%s&lam_type=option1&piste=%d&sisallytakaistat=0",
                start, end, tmsId
        );

        try {
            String csv = getCSVResponse(url);

            return parseTrafficCsv(csv);

        } catch (Exception e) {
            e.printStackTrace();
            return new TrafficBundleDto(new HashMap<>(), new HashMap<>());
        }
    }

    private TrafficBundleDto parseTrafficCsv(String csv) {

        Map<LocalDate, Integer> vehicleCounts = new HashMap<>();
        Map<LocalDate, Double> weightedSpeed = new HashMap<>();
        Map<LocalDate, Integer> weight = new HashMap<>();

        String[] lines = csv.split("\n");

        // Skip header line
        for (int i = 1; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty()) continue;

            String[] parts = line.split(";");

            if (parts.length < 10) continue;

            String dateStr = parts[2];
            LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyyMMdd")); // pvm = yyyyMMdd or yyyy-MM-dd depending on endpoint
            int vehicles = Integer.parseInt(parts[6]);
            double avgSpeed = Double.parseDouble(parts[9]);

            vehicleCounts.merge(date, vehicles, Integer::sum);

            // Weighted speed = sum(avgSpeed * vehicles) / sum(vehicles)
            weightedSpeed.merge(date, avgSpeed * vehicles, Double::sum);
            weight.merge(date, vehicles, Integer::sum);
        }

        // Compute final weighted average
        Map<LocalDate, Double> finalAvgSpeed = new HashMap<>();
        for (LocalDate date : weight.keySet()) {
            int w = weight.get(date);
            double totalSpeed = weightedSpeed.get(date);
            finalAvgSpeed.put(date, totalSpeed / w);
        }

        return new TrafficBundleDto(vehicleCounts, finalAvgSpeed);
    }

    public TrafficHistoryDto getHistoricalTraffic(long stationId, LocalDate start, LocalDate end) {
    int tmsNumber = getTMSNumber(stationId);
    if (tmsNumber < 0) {
        return new TrafficHistoryDto();
    }

    TrafficBundleDto bundle = getDailyTrafficFromCsv(tmsNumber, start, end);

    return new TrafficHistoryDto(
        bundle.getVehicleCounts(),
        bundle.getAvgSpeeds()
    );
}



    // https://tie.digitraffic.fi/api/tms/v1/history
    // ?api=raakaliikennemaara&
    // tyyppi=h&
    // pvm=2025-10-26&
    // loppu=2025-11-01&
    // lam_type=option1&
    // piste=99&
    // luokka=kaikki&
    // suunta=&
    // sisallytakaistat=0


    





}
