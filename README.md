# COMP.SE.110 — Group assignment repository
___
## Introduction
The purpose of this project is to design and implement a prototype that demonstrates how software systems can integrate multiple data sources to provide meaningful, data-driven insights. 
Our application focuses on exploring the relationship between weather and road traffic flow in Finland. This goal is reached by combining the information from two external APIs – Digitraffic and Open-Meteo. 
By collecting and visualizing this data, our system aims to provide a clearer understanding of how weather impacts average vehicle speed, traffic density and road conditions throughout the year. 

The application will allow users to:
- View an overview of current and historical weather and traffic data for a selected area. 
- Compare different locations or time periods to observe seasonal trends. 
- Visualize correlations between traffic performance and environmental conditions through graphs and charts. 
- Access live or recent road camera images to complement the data contextually. 

From a software design perspective, the project demonstrates the use of modular architecture, API integration, and interactive visualization. 
The backend, built in Java using Spring Boot, retrieves and processes data from the two external APIs, while the frontend presents the results through clear, user-friendly visualizations. 
___
___

## SETUP
You can find the process of setting up the application in the collapsibles down below.

<details><summary>Docker Compose</summary>

To start the application, one must have Docker installed on their machine. 
We chose to use it for the deployment to make it easier for users and developers to start and use it.

Instructions:

After cloning the repository, you should be in the correct directory (group05). Then run:
```
docker compose up --build
```
</details>



<details><summary>Manual Setup</summary>
If for some reason it's preferred to start the services separately, one should follow this sequence of actions:

___
### BACKEND
 1. BUILD PHASE. 
 
 To build the application, you should be in /backend directory and run:
 
  ``` 
 mvn clean install 
 ```
 2. RUN PHASE. 
 ``` 
 java -jar target/weather-traffic-1.0.0.jar 
 ``` 
 (it's recommended to check the specific name in _target_ folder)

___
 ### FRONTEND
 One should be situated in /frontend directory
 1. INSTALLING REQUIRED DEPENDENCIES. 
 ```
 npm install
 ```
 2. STARTING THE APPLICATION

 ```
 npm run dev
 ```
</details>

___
___

## ACCESSING WEB APPLICATION

After that, you should be able to access the frontend in your localhost via port 80:

```
http://localhost:80
```

Backend is also on localhost, with port 8081.
```
http://localhost:8081
```
