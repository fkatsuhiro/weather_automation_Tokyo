import { useEffect, useState } from 'react';

interface WeatherData {
  date: string;
  weather_code: number;
  temperature: number;
}

function App() {
  const [logs, setLogs] = useState<WeatherData[]>([]);

  useEffect(() => {
    //fetch('./weather_log_test.json')
    fetch('./weather_log.json')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLogs(data);
        }
      })
      .catch((err) => console.error("データ読み込みエラー:", err));
  }, []);

  const getWeatherDisplay = (code: number) => {
    if (code === 0) return { icon: "☀️", label: "快晴" };
    if (code <= 3) return { icon: "🌤️", label: "晴れ・曇り" };
    if (code === 45 || code === 48) return { icon: "🌫️", label: "霧" };
    if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return { icon: "☔", label: "雨" };
    if ((code >= 66 && code <= 77) || (code >= 85 && code <= 86)) return { icon: "❄️", label: "雪" };
    if (code >= 95) return { icon: "⚡", label: "雷" };
    return { icon: "❓", label: "不明" };
  };

  // --- 日付ごとにグループ化する処理 ---
  const groupedLogs: Record<string, WeatherData[]> = logs.reduce((acc, log) => {
    const dateKey = log.date.split('T')[0]; // "2026-03-02" を抽出
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, WeatherData[]>);
  const sortedDates = Object.keys(groupedLogs).sort().reverse();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f5f5f5' }}>
      <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px', textAlign: 'center' }}>
        ☀️ 東京 天気ダッシュボード
      </h1>

      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {sortedDates.length === 0 ? (
          <p>データ取得中...</p>
        ) : (
          sortedDates.map((date) => (
            <div key={date} style={{
              backgroundColor: '#fff',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              border: '1px solid #eee'
            }}>
              <h2 style={{ fontSize: '1.2rem', color: '#555', marginBottom: '15px', borderLeft: '4px solid #3498db', paddingLeft: '10px' }}>
                {new Intl.DateTimeFormat('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                }).format(new Date(date))}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '15px' }}>
                {groupedLogs[date]
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((log, i) => {
                    const display = getWeatherDisplay(log.weather_code);
                    const time = log.date.split('T')[1];

                    return (
                      <div key={i} style={{
                        textAlign: 'center',
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '10px'
                      }}>
                        <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '5px' }}>{time}</div>
                        <div style={{ fontSize: '1.8rem', margin: '5px 0' }}>{display.icon}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e67e22' }}>
                          {log.temperature.toFixed(1)}℃
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))
        )}
      </div>
    </div >
  );
}

export default App;