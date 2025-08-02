import { type NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');

    if (!city) {
        return NextResponse.json(
            { error: 'City parameter is required' },
            { status: 400 }
        );
    }

    if (!OPENWEATHER_API_KEY) {
        return NextResponse.json(
            { error: 'OpenWeather API key is not configured' },
            { status: 500 }
        );
    }

    try {
        // Fetch current weather
        const currentWeatherResponse = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(
                city
            )}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );

        if (!currentWeatherResponse.ok) {
            if (currentWeatherResponse.status === 404) {
                return NextResponse.json(
                    { error: 'City not found in our cosmic database' },
                    { status: 404 }
                );
            }
            throw new Error('Failed to fetch current weather');
        }

        const currentWeather = await currentWeatherResponse.json();

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(
                city
            )}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );

        if (!forecastResponse.ok) {
            throw new Error('Failed to fetch forecast');
        }

        const forecastData = await forecastResponse.json();

        // Fetch UV Index
        const uvResponse = await fetch(
            `${BASE_URL}/uvi?lat=${currentWeather.coord.lat}&lon=${currentWeather.coord.lon}&appid=${OPENWEATHER_API_KEY}`
        );

        let uvIndex = 0;
        if (uvResponse.ok) {
            const uvData = await uvResponse.json();
            uvIndex = Math.round(uvData.value || 0);
        }

        // Process hourly forecast (next 24 hours)
        const hourlyForecasts = [];
        for (let i = 0; i < Math.min(24, forecastData.list.length); i++) {
            const item = forecastData.list[i];
            const date = new Date(item.dt * 1000);
            hourlyForecasts.push({
                time: date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                temperature: item.main.temp,
                icon: item.weather[0].icon,
                description: item.weather[0].description,
            });
        }

        // Process daily forecasts (7 days)
        const dailyForecasts = [];
        const processedDates = new Set();

        for (const item of forecastData.list) {
            const date = new Date(item.dt * 1000);
            const dateString = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });

            if (!processedDates.has(dateString) && dailyForecasts.length < 7) {
                // Find min/max temps for this day
                const dayItems = forecastData.list.filter((listItem: any) => {
                    const listDate = new Date(listItem.dt * 1000);
                    return listDate.toDateString() === date.toDateString();
                });

                const temps = dayItems.map((dayItem: any) => dayItem.main.temp);
                const minTemp = Math.min(...temps);
                const maxTemp = Math.max(...temps);

                dailyForecasts.push({
                    date: dateString,
                    temperature: item.main.temp,
                    minTemp,
                    maxTemp,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon,
                });
                processedDates.add(dateString);
            }
        }

        // Format sunrise/sunset times
        const sunrise = new Date(
            currentWeather.sys.sunrise * 1000
        ).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
        const sunset = new Date(
            currentWeather.sys.sunset * 1000
        ).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });

        // Format the response
        const weatherData = {
            name: currentWeather.name,
            country: currentWeather.sys.country,
            temperature: currentWeather.main.temp,
            description: currentWeather.weather[0].description,
            icon: currentWeather.weather[0].icon,
            humidity: currentWeather.main.humidity,
            windSpeed: currentWeather.wind.speed,
            pressure: currentWeather.main.pressure,
            visibility: Math.round(currentWeather.visibility / 1000), // Convert to km
            feelsLike: currentWeather.main.feels_like,
            uvIndex,
            sunrise,
            sunset,
            forecast: dailyForecasts,
            hourlyForecast: hourlyForecasts,
        };

        return NextResponse.json(weatherData);
    } catch (error) {
        console.error('Weather API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch weather data from the cosmos' },
            { status: 500 }
        );
    }
}
