// package com.group05.config;

// import java.net.http.HttpClient;

// import 
// import 
// import 

// org.apache.http.impl.client.HttpClients
// org.apache.http.client.protocol.RequestAcceptEncoding
// org.apache.http.client.protocol.ResponseContentEncoding
// org.springframework.http.client.HttpComponentsClientHttpRequestFactory
// org.springframework.web.client.RestTemplate

// @Configuration
// public class RestClientConfig {

//     @Bean
//     public RestTemplate restTemplate() {
//         // Build HttpClient that supports GZIP automatically
//         HttpClient httpClient = HttpClients.custom()
//                 .addInterceptorFirst)
//                 .addInterceptorFirst(new ResponseContentEncoding())
//                 .build();

//         HttpComponentsClientHttpRequestFactory requestFactory =
//                 new HttpComponentsClientHttpRequestFactory(httpClient);

//         return new RestTemplate(requestFactory);
//     }
// }