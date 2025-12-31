package com.group05.dto.traffic;

import java.util.List;

public class StationBaseDto {
    private long id;
    private String name;
    private Double[] coordinates = new Double[2];

    public StationBaseDto() {   }

    public StationBaseDto(long id, String name, List<Double> coords) {
        this.id = id;
        this.name = name;
        this.coordinates[0] = coords.get(0);
        this.coordinates[1] = coords.get(1);
    }

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Double[] getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(Double[] coordinates) {
        this.coordinates = coordinates;
    }
}
