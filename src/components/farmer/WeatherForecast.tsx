import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockWeatherForecast, WeatherDay } from '@/data/smartFarmingData';
import { Cloud, CloudRain, CloudLightning, Sun, CloudSun, Droplets, Wind, Thermometer, Lightbulb } from 'lucide-react';

const weatherIcons: Record<WeatherDay['condition'], React.ReactNode> = {
  sunny: <Sun className="h-8 w-8 text-amber-500" />,
  partly_cloudy: <CloudSun className="h-8 w-8 text-amber-400" />,
  cloudy: <Cloud className="h-8 w-8 text-muted-foreground" />,
  rainy: <CloudRain className="h-8 w-8 text-blue-500" />,
  stormy: <CloudLightning className="h-8 w-8 text-destructive" />,
};

export function WeatherForecast() {
  const today = mockWeatherForecast[0];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">🌦️ Weather Forecast</h2>

      {/* Today's Weather - Hero Card */}
      <Card className="border-2 border-farmer/30 bg-gradient-to-br from-card to-muted/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today, {today.date}</p>
              <p className="text-4xl font-bold text-foreground">{today.temp}°C</p>
              <p className="text-sm text-muted-foreground">Low: {today.tempMin}°C</p>
            </div>
            <div className="text-center">
              {weatherIcons[today.condition]}
              <p className="text-sm capitalize mt-1 text-muted-foreground">
                {today.condition.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-semibold text-foreground">{today.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-xs text-muted-foreground">Rainfall</p>
                <p className="font-semibold text-foreground">{today.rainfall}mm</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="font-semibold text-foreground">{today.wind} km/h</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-farmer/10 rounded-lg flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-farmer mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">{today.farmingTip}</p>
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Forecast */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {mockWeatherForecast.map((day, i) => (
              <div
                key={i}
                className={`text-center p-2 rounded-lg ${i === 0 ? 'bg-farmer/10 border border-farmer/30' : 'hover:bg-muted/50'}`}
              >
                <p className="text-xs font-medium text-muted-foreground">{day.day}</p>
                <div className="my-2 flex justify-center scale-75">
                  {weatherIcons[day.condition]}
                </div>
                <p className="text-sm font-bold text-foreground">{day.temp}°</p>
                <p className="text-xs text-muted-foreground">{day.tempMin}°</p>
                {day.rainfall > 0 && (
                  <p className="text-xs text-blue-500 mt-1">{day.rainfall}mm</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      {mockWeatherForecast.some(d => d.condition === 'stormy') && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-3">
            <CloudLightning className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">⚠️ Storm Warning</p>
              <p className="text-sm text-muted-foreground mt-1">
                Heavy rainfall expected on Thursday. Secure crops, drain excess water, and avoid outdoor spraying.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
