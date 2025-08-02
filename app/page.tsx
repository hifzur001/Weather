"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, MapPin, Droplets, Wind, Eye, Gauge, Thermometer, Sun, Moon, Cloud } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StarField } from "./components/star-field"

interface WeatherData {
  name: string
  country: string
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  pressure: number
  visibility: number
  feelsLike: number
  uvIndex: number
  sunrise: string
  sunset: string
  forecast: ForecastItem[]
  hourlyForecast: HourlyForecastItem[]
}

interface ForecastItem {
  date: string
  temperature: number
  minTemp: number
  maxTemp: number
  description: string
  icon: string
}

interface HourlyForecastItem {
  time: string
  temperature: number
  icon: string
  description: string
}

export default function WeatherApp() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [city, setCity] = useState("")

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weather data")
      }

      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchWeather(city)
  }

  useEffect(() => {
    fetchWeather("London")
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <StarField />

      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cosmic Weather
            </h1>
            <p className="text-gray-300">Explore weather across the universe</p>
          </div>

          {/* Search */}
          <Card className="mb-8 bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search any city in the cosmos..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 transition-all duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? "Scanning..." : "Explore"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="mb-8 bg-red-900/40 backdrop-blur-xl border-red-700/50">
              <CardContent className="p-4">
                <p className="text-red-300 text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Weather Display */}
          {weather && (
            <div className="space-y-6">
              {/* Main Weather Card */}
              <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <h2 className="text-3xl font-bold text-white">
                        {weather.name}, {weather.country}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Temperature */}
                    <div className="lg:col-span-1">
                      <div className="text-center">
                        <div className="relative mb-4">
                          <img
                            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                            alt={weather.description}
                            className="w-32 h-32 mx-auto drop-shadow-2xl"
                          />
                        </div>
                        <p className="text-7xl font-bold text-white mb-2">{Math.round(weather.temperature)}°</p>
                        <p className="text-blue-300 capitalize text-xl mb-2">{weather.description}</p>
                        <p className="text-gray-400">Feels like {Math.round(weather.feelsLike)}°C</p>
                      </div>
                    </div>

                    {/* Weather Details Grid */}
                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gray-700/30 rounded-xl p-4 text-center backdrop-blur-sm border border-gray-600/30">
                        <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-300">Humidity</p>
                        <p className="text-2xl font-bold text-white">{weather.humidity}%</p>
                      </div>
                      <div className="bg-gray-700/30 rounded-xl p-4 text-center backdrop-blur-sm border border-gray-600/30">
                        <Wind className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-300">Wind Speed</p>
                        <p className="text-2xl font-bold text-white">{weather.windSpeed} m/s</p>
                      </div>
                      <div className="bg-gray-700/30 rounded-xl p-4 text-center backdrop-blur-sm border border-gray-600/30">
                        <Gauge className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-300">Pressure</p>
                        <p className="text-2xl font-bold text-white">{weather.pressure} hPa</p>
                      </div>
                      <div className="bg-gray-700/30 rounded-xl p-4 text-center backdrop-blur-sm border border-gray-600/30">
                        <Eye className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-300">Visibility</p>
                        <p className="text-2xl font-bold text-white">{weather.visibility} km</p>
                      </div>
                      <div className="bg-gray-700/30 rounded-xl p-4 text-center backdrop-blur-sm border border-gray-600/30">
                        <Sun className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-300">UV Index</p>
                        <p className="text-2xl font-bold text-white">{weather.uvIndex}</p>
                      </div>
                      <div className="bg-gray-700/30 rounded-xl p-4 text-center backdrop-blur-sm border border-gray-600/30">
                        <Thermometer className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-300">Range</p>
                        <p className="text-lg font-bold text-white">
                          {Math.round(weather.forecast[0]?.minTemp || weather.temperature)}° /{" "}
                          {Math.round(weather.forecast[0]?.maxTemp || weather.temperature)}°
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sun Times */}
                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-4 border border-orange-400/30">
                      <div className="flex items-center gap-3">
                        <Sun className="w-6 h-6 text-orange-400" />
                        <div>
                          <p className="text-sm text-gray-300">Sunrise</p>
                          <p className="text-xl font-bold text-white">{weather.sunrise}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-400/30">
                      <div className="flex items-center gap-3">
                        <Moon className="w-6 h-6 text-indigo-400" />
                        <div>
                          <p className="text-sm text-gray-300">Sunset</p>
                          <p className="text-xl font-bold text-white">{weather.sunset}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hourly Forecast */}
              <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Cloud className="w-6 h-6 text-blue-400" />
                    24-Hour Forecast
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {weather.hourlyForecast.map((hour, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 bg-gray-700/30 rounded-xl p-4 text-center min-w-[100px] backdrop-blur-sm border border-gray-600/30"
                      >
                        <p className="text-sm text-gray-300 mb-2">{hour.time}</p>
                        <img
                          src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                          alt={hour.description}
                          className="w-12 h-12 mx-auto mb-2"
                        />
                        <p className="text-lg font-bold text-white">{Math.round(hour.temperature)}°</p>
                        <p className="text-xs text-gray-400 capitalize">{hour.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 7-Day Forecast */}
              <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">7-Day Forecast</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                    {weather.forecast.map((day, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/30 rounded-xl p-4 text-center backdrop-blur-sm border border-gray-600/30 hover:bg-gray-600/40 transition-all duration-300"
                      >
                        <p className="text-sm text-gray-300 mb-2 font-medium">{day.date}</p>
                        <img
                          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                          alt={day.description}
                          className="w-12 h-12 mx-auto mb-2"
                        />
                        <p className="text-lg font-bold text-white mb-1">{Math.round(day.temperature)}°</p>
                        <p className="text-sm text-gray-400 mb-2">
                          {Math.round(day.minTemp)}° / {Math.round(day.maxTemp)}°
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Loading State */}
          {loading && !weather && (
            <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <div
                    className="absolute inset-0 rounded-full h-16 w-16 border-r-2 border-purple-400 mx-auto animate-spin"
                    style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                  ></div>
                </div>
                <p className="text-white text-lg">Scanning the cosmos...</p>
                <p className="text-gray-400 text-sm mt-2">Gathering weather data from the stars</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
