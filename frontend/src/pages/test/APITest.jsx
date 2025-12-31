// 测试后端 API 的脚本
// 在浏览器控制台运行此代码

async function testBackendAPI() {
  console.log("=== 测试后端 API ===");
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  const url = `http://localhost:8081/api/merged?stationId=23001&from=${startDate.toISOString()}&to=${endDate.toISOString()}`;
  
  console.log("请求 URL:", url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error("❌ API 响应失败:", response.status);
      const text = await response.text();
      console.error("错误信息:", text);
      return;
    }
    
    const data = await response.json();
    
    console.log("✅ API 响应成功!");
    console.log("城市名称:", data.cityName);
    console.log("温度:", data.temperature, "°C");
    console.log("风速:", data.windSpeed, "km/h");
    console.log("降水:", data.precipitation, "mm");
    console.log("平均速度:", data.avgSpeed, "km/h");
    console.log("车辆数:", data.vehicleCount);
    console.log("日出:", data.sunrise);
    console.log("日落:", data.sunset);
    console.log("小时数据条数:", data.hourly?.length || 0);
    
    if (data.hourly && data.hourly.length > 0) {
      console.log("\n最新一条小时数据:");
      const latest = data.hourly[data.hourly.length - 1];
      console.log("- 时间:", latest.timestamp);
      console.log("- 温度:", latest.temperatureC, "°C");
      console.log("- 速度:", latest.avgSpeedKph, "km/h");
      console.log("- 车辆:", latest.vehicleCount);
      console.log("- 降水:", latest.precipitationMm, "mm");
    }
    
    // 检查数据质量
    console.log("\n=== 数据质量检查 ===");
    
    if (data.sunrise === "N/A" || data.sunset === "N/A") {
      console.warn("⚠️ 日出日落数据未正确解析");
    } else {
      console.log("✅ 日出日落数据正常");
    }
    
    const validSpeeds = data.hourly?.filter(h => h.avgSpeedKph > 0).length || 0;
    console.log(`✅ 有效速度数据: ${validSpeeds}/${data.hourly?.length || 0}`);
    
    const validVehicles = data.hourly?.filter(h => h.vehicleCount > 0).length || 0;
    console.log(`✅ 有效车辆数据: ${validVehicles}/${data.hourly?.length || 0}`);
    
    return data;
    
  } catch (error) {
    console.error("❌ 请求失败:", error);
  }
}

// 运行测试
testBackendAPI();