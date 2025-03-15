import fs from "fs";
import qty from "js-quantities";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.VITE_WEATHER_API_KEY;

const emojis = {
  "01d": "☀️",
  "02d": "⛅️",
  "03d": "☁️",
  "04d": "☁️",
  "09d": "🌧",
  "10d": "🌦",
  "11d": "🌩",
  "13d": "❄️",
  "50d": "🌫",
};

const nowUTC = new Date();
const nowKSTString = nowUTC.toLocaleString("en-US", { timeZone: "Asia/Seoul" }); // KST 변환 (문자열)
const nowKST = new Date(nowKSTString);

const todayDay = new Intl.DateTimeFormat("ko-KR", { weekday: "long" }).format(
  nowKST
);
console.log("🟢 최종 todayDay:", todayDay);

const lat = 35.8714354;
const lon = 128.601445;

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${API_KEY}&units=metric`;

const response = await fetch(url);
const data = await response.json();

if (!data.main) {
  console.error("API 응답 오류: main 데이터가 없음", data);
} else {
  const degC = Math.round(data.main.temp_max);
  const icon = data.weather[0].icon;

  fs.readFile(
    path.join(__dirname, "template.svg"),
    "utf-8",
    (error, fileData) => {
      if (error) {
        console.error("파일 읽기 오류:", error);
        return;
      }

      fileData = fileData.replace("{degC}", degC);
      fileData = fileData.replace("{weatherEmoji}", emojis[icon]);
      fileData = fileData.replace("{todayDay}", todayDay);

      fs.writeFile(path.join(__dirname, "chat.svg"), fileData, (err) => {
        if (err) console.error("파일 쓰기 오류:", err);
      });
    }
  );
}
