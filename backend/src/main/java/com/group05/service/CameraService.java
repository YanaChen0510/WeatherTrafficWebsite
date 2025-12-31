package com.group05.service;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.zip.GZIPInputStream;
import java.time.*;
import java.time.format.DateTimeFormatter;

import com.group05.dto.traffic.*;
import com.fasterxml.jackson.databind.JsonNode;

// // Swagger documentation for Digitraffic
// // https://tie.digitraffic.fi/swagger/#/Weathercam%20V1/getWeathercamsPresetsHistory


import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

@Service
public class CameraService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "https://tie.digitraffic.fi/api/weathercam/v1";
    ObjectMapper mapper = new ObjectMapper();

    public WeatherCameraDto getWeatherCamera(String id) {
        try {

            String json = getResponseJSON("/stations/" + id);

            WeatherCameraDto station = new WeatherCameraDto();

            JsonNode root = mapper.readTree(json);
            JsonNode properties = root.get("properties");

            JsonNode coordinates = root.get("geometry").get("coordinates");
            station.setLatitude(coordinates.get(1).asDouble());
            station.setLongitude(coordinates.get(0).asDouble());

            String name = properties.get("name").asText().replaceAll("^\"|\"$", "");
            station.setName(name);

            station.setId(id);


            LocalDateTime lastUpdated = Instant.parse(properties.get("dataUpdatedTime").asText())
                                        .atZone(ZoneOffset.UTC).toLocalDateTime();
            station.setTime(lastUpdated);

            station.setImageUrl(getCameraImagesForLastHour(id));

            return station;
        } catch(Exception e) {
            System.out.println("An error occured: " + e.getMessage());
            return null;
        }
    }

    public List<WeatherCameraDto> getAllCameraStations() {
        try {
            String json = getResponseJSON("/stations");

            JsonNode root = mapper.readTree(json);
            JsonNode features = root.get("features");

            if (features == null || !features.isArray()) return new ArrayList<>();

            List<WeatherCameraDto> stations = new ArrayList<>();

            for (JsonNode feature : features) {
                
                WeatherCameraDto station = new WeatherCameraDto();

                JsonNode coordinates = feature.get("geometry").get("coordinates");
                station.setLatitude(coordinates.get(1).asDouble());
                station.setLongitude(coordinates.get(0).asDouble());

                JsonNode properties = feature.get("properties");

                String name = properties.get("name").asText().replaceAll("^\"|\"$", "");
                station.setName(name);

                DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

                LocalDateTime lastUpdated = ZonedDateTime
                        .parse(properties.get("dataUpdatedTime").asText(), formatter)
                        .toLocalDateTime();

                station.setTime(lastUpdated);
    
                String id = properties.get("id").asText();
                station.setId(id);

                stations.add(station);
            }

            return stations;

        } catch(Exception e) {
            System.out.println("An error occured: " + e.getMessage());
            return null;
        }
    }

    public List<List<String>> getCameraImagesForLastHour(String cameraId) {
        try {
            String json = getResponseJSON("/stations/" + cameraId + "/history");
            JsonNode root = mapper.readTree(json);

            Instant oneHourAgo = Instant.now().minus(Duration.ofHours(1));
            List<List<String>> result = new ArrayList<>();

            JsonNode presets = root.path("presets");

            for (JsonNode preset : presets) {
                JsonNode history = preset.path("history");

                List<String> urls = new ArrayList<>();

                // Iterate backwards: newest -> oldest
                for (int i = history.size() - 1; i >= 0; i--) {
                    JsonNode entry = history.get(i);

                    Instant time = Instant.parse(entry.get("lastModified").asText());
                    if (time.isBefore(oneHourAgo)) {
                        break;
                    }

                    String url = entry.get("imageUrl").asText();

                    if (urlExists(url)) {
                        urls.add(url);
                    }
                }
                Collections.reverse(urls);
                result.add(urls);
            }

            return result;

        } catch (Exception e) {
            System.out.println("Error collecting images: " + e.getMessage());
            return List.of();
        }
    }


    private boolean urlExists(String url) {
        try {
            restTemplate.headForHeaders(url);
            return true;
        } catch (Exception e) {
            return false;
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

    
}


// https://tie.digitraffic.fi/api/weathercam/v1/stations