import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, MapPin, Thermometer, Wind, Droplets, Eye, Gauge } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  pressure: number;
  feelsLike: number;
  uvIndex: number;
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  precipChance: number;
}

type WeatherCondition = 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Light Rain' | 'Heavy Rain' | 'Snow';
type WindDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

const UKWeatherApp: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('London');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const ukCities: readonly string[] = [
    'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 
    'Sheffield', 'Bristol', 'Glasgow', 'Edinburgh', 'Cardiff',
    'Newcastle', 'Nottingham', 'Brighton', 'Oxford', 'Cambridge'
  ] as const;

  const weatherConditions: WeatherCondition[] = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Snow'];
  const windDirections: WindDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  // Mock weather data generator for demonstration
  const generateMockWeather = (city: string): WeatherData => {
    const condition: WeatherCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const baseTemp: number = city === 'Glasgow' || city === 'Edinburgh' ? 8 : 12;
    const temperature: number = Math.round(baseTemp + (Math.random() * 10 - 5));
    
    return {
      location: city,
      temperature,
      condition,
      humidity: Math.round(60 + Math.random() * 30),
      windSpeed: Math.round(5 + Math.random() * 15),
      windDirection: windDirections[Math.floor(Math.random() * windDirections.length)],
      visibility: Math.round(10 + Math.random() * 15),
      pressure: Math.round(1000 + Math.random() * 50),
      feelsLike: Math.round(baseTemp + (Math.random() * 8 - 4)),
      uvIndex: Math.round(Math.random() * 6)
    };
  };

  const generateMockForecast = (): ForecastDay[] => {
    const forecastConditions: WeatherCondition[] = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain'];
    const days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return Array.from({ length: 7 }, (_, i: number): ForecastDay => ({
      date: days[i],
      high: Math.round(10 + Math.random() * 8),
      low: Math.round(4 + Math.random() * 6),
      condition: forecastConditions[Math.floor(Math.random() * forecastConditions.length)],
      precipChance: Math.round(Math.random() * 100)
    }));
  };

  const getWeatherIcon = (condition: string): JSX.Element => {
    const iconProps = { className: "w-8 h-8" };
    
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun {...iconProps} className="w-8 h-8 text-yellow-500" />;
      case 'partly cloudy':
        return <Cloud {...iconProps} className="w-8 h-8 text-gray-400" />;
      case 'cloudy':
        return <Cloud {...iconProps} className="w-8 h-8 text-gray-600" />;
      case 'light rain':
      case 'heavy rain':
        return <CloudRain {...iconProps} className="w-8 h-8 text-blue-500" />;
      case 'snow':
        return <CloudSnow {...iconProps} className="w-8 h-8 text-blue-200" />;
      default:
        return <Sun {...iconProps} className="w-8 h-8 text-yellow-500" />;
    }
  };

  const fetchWeatherData = async (city: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
      
      setCurrentWeather(generateMockWeather(city));
      setForecast(generateMockForecast());
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCity(event.target.value);
  };

  const formatDate = (): string => {
    return new Date().toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Weather Error</h2>
          <p className="text-red-100 mb-4">{error}</p>
          <button 
            onClick={() => fetchWeatherData(selectedCity)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">UK Weather</h1>
          <p className="text-blue-100">Your local weather forecast</p>
        </header>

        {/* City Selector */}
        <section className="mb-8">
          <label htmlFor="city-select" className="sr-only">Select a UK city</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={handleCityChange}
            className="w-full max-w-xs mx-auto block px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Select UK city for weather forecast"
          >
            {ukCities.map((city: string) => (
              <option key={city} value={city} className="text-gray-800">
                {city}
              </option>
            ))}
          </select>
        </section>

        {loading ? (
          <div className="text-center" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Loading weather data...</p>
          </div>
        ) : (
          <>
            {/* Current Weather Card */}
            {currentWeather && (
              <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-white" aria-hidden="true" />
                    <h2 className="text-2xl font-bold text-white">{currentWeather.location}</h2>
                  </div>
                  <div className="text-right">
                    <time className="text-sm text-blue-100">
                      {formatDate()}
                    </time>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                      <div aria-label={`Weather condition: ${currentWeather.condition}`}>
                        {getWeatherIcon(currentWeather.condition)}
                      </div>
                      <div>
                        <p className="text-5xl font-bold text-white" aria-label={`Current temperature: ${currentWeather.temperature} degrees Celsius`}>
                          {currentWeather.temperature}°C
                        </p>
                        <p className="text-blue-100">Feels like {currentWeather.feelsLike}°C</p>
                      </div>
                    </div>
                    <p className="text-xl text-white mb-2">{currentWeather.condition}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center space-x-2 mb-1">
                        <Wind className="w-4 h-4 text-blue-200" aria-hidden="true" />
                        <span className="text-sm text-blue-200">Wind</span>
                      </div>
                      <p className="text-white font-semibold">{currentWeather.windSpeed} mph {currentWeather.windDirection}</p>
                    </div>

                    <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center space-x-2 mb-1">
                        <Droplets className="w-4 h-4 text-blue-200" aria-hidden="true" />
                        <span className="text-sm text-blue-200">Humidity</span>
                      </div>
                      <p className="text-white font-semibold">{currentWeather.humidity}%</p>
                    </div>

                    <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center space-x-2 mb-1">
                        <Eye className="w-4 h-4 text-blue-200" aria-hidden="true" />
                        <span className="text-sm text-blue-200">Visibility</span>
                      </div>
                      <p className="text-white font-semibold">{currentWeather.visibility} km</p>
                    </div>

                    <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center space-x-2 mb-1">
                        <Gauge className="w-4 h-4 text-blue-200" aria-hidden="true" />
                        <span className="text-sm text-blue-200">Pressure</span>
                      </div>
                      <p className="text-white font-semibold">{currentWeather.pressure} mb</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 7-Day Forecast */}
            <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">7-Day Forecast</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {forecast.map((day: ForecastDay, index: number) => (
                  <article key={`${day.date}-${index}`} className="bg-white/10 rounded-lg p-4 text-center border border-white/10">
                    <h4 className="text-sm font-semibold text-white mb-2">{day.date}</h4>
                    <div className="flex justify-center mb-2" aria-label={`${day.date} weather: ${day.condition}`}>
                      {getWeatherIcon(day.condition)}
                    </div>
                    <p className="text-sm text-blue-100 mb-2">{day.condition}</p>
                    <div className="text-white">
                      <p className="font-semibold" aria-label={`High temperature: ${day.high} degrees`}>{day.high}°</p>
                      <p className="text-sm text-blue-200" aria-label={`Low temperature: ${day.low} degrees`}>{day.low}°</p>
                    </div>
                    <p className="text-xs text-blue-200 mt-2" aria-label={`Chance of rain: ${day.precipChance} percent`}>
                      {day.precipChance}% rain
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Weather Alerts Banner */}
            <aside className="mt-6 bg-amber-500/20 backdrop-blur-sm rounded-lg p-4 border border-amber-400/30" role="banner">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" aria-hidden="true"></div>
                <p className="text-white text-sm">
                  <span className="font-semibold">Weather Notice:</span> This is a demonstration app with mock data. 
                  For real weather information, please consult the Met Office or other official weather services.
                </p>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default UKWeatherApp;
