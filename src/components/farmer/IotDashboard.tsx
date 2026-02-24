import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { mockIrrigationZones, IrrigationZone } from '@/data/smartFarmingData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, Thermometer, Power, Clock, Leaf, Gauge, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function IotDashboard() {
  const [zones, setZones] = useState(mockIrrigationZones);
  const [selectedZone, setSelectedZone] = useState<IrrigationZone>(zones[0]);

  const togglePump = (zoneId: string) => {
    setZones(prev => prev.map(z => {
      if (z.id === zoneId) {
        const newStatus = z.pumpStatus === 'on' ? 'off' : 'on';
        toast.success(`${z.name}: Pump turned ${newStatus.toUpperCase()}`);
        return { ...z, pumpStatus: newStatus as 'on' | 'off' };
      }
      return z;
    }));
    setSelectedZone(prev =>
      prev.id === zoneId
        ? { ...prev, pumpStatus: prev.pumpStatus === 'on' ? 'off' : 'on' }
        : prev
    );
  };

  const toggleAuto = (zoneId: string) => {
    setZones(prev => prev.map(z => {
      if (z.id === zoneId) {
        const newStatus = z.pumpStatus === 'auto' ? 'off' : 'auto';
        toast.success(`${z.name}: Auto-irrigation ${newStatus === 'auto' ? 'enabled' : 'disabled'}`);
        return { ...z, pumpStatus: newStatus as 'auto' | 'off' };
      }
      return z;
    }));
    setSelectedZone(prev =>
      prev.id === zoneId
        ? { ...prev, pumpStatus: prev.pumpStatus === 'auto' ? 'off' : 'auto' }
        : prev
    );
  };

  const getMoistureStatus = (zone: IrrigationZone) => {
    if (zone.currentMoisture < zone.optimalMoistureMin) return { label: 'Low', color: 'text-destructive' };
    if (zone.currentMoisture > zone.optimalMoistureMax) return { label: 'High', color: 'text-blue-500' };
    return { label: 'Optimal', color: 'text-success' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">💧 Smart Irrigation</h2>
        <Badge variant="outline" className="text-xs">
          {zones.filter(z => z.pumpStatus === 'on' || z.pumpStatus === 'auto').length} active
        </Badge>
      </div>

      {/* Zone Overview Cards */}
      <div className="grid gap-3">
        {zones.map(zone => {
          const status = getMoistureStatus(zone);
          const isSelected = selectedZone.id === zone.id;
          const needsWater = zone.currentMoisture < zone.optimalMoistureMin;

          return (
            <Card
              key={zone.id}
              className={`cursor-pointer transition-all ${
                isSelected ? 'border-farmer ring-1 ring-farmer/30' : ''
              } ${needsWater ? 'border-destructive/30' : ''}`}
              onClick={() => setSelectedZone(zone)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{zone.name}</p>
                    <p className="text-xs text-muted-foreground">{zone.crop} • {zone.area}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {needsWater && <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />}
                    <Badge
                      className={`text-xs ${
                        zone.pumpStatus === 'on' ? 'bg-success text-success-foreground' :
                        zone.pumpStatus === 'auto' ? 'bg-farmer text-farmer-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}
                    >
                      {zone.pumpStatus === 'auto' ? '🤖 Auto' : zone.pumpStatus === 'on' ? '💧 Pump ON' : 'Pump OFF'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Soil Moisture</span>
                    <span className={`font-semibold ${status.color}`}>
                      {zone.currentMoisture}% ({status.label})
                    </span>
                  </div>
                  <Progress
                    value={zone.currentMoisture}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: {zone.optimalMoistureMin}%</span>
                    <span>Max: {zone.optimalMoistureMax}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Watered {zone.lastWatered}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Auto</span>
                      <Switch
                        checked={zone.pumpStatus === 'auto'}
                        onCheckedChange={() => toggleAuto(zone.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant={zone.pumpStatus === 'on' ? 'destructive' : 'default'}
                      className={zone.pumpStatus !== 'on' ? 'bg-farmer hover:bg-farmer/90' : ''}
                      onClick={(e) => { e.stopPropagation(); togglePump(zone.id); }}
                      disabled={zone.pumpStatus === 'auto'}
                    >
                      <Power className="h-3 w-3 mr-1" />
                      {zone.pumpStatus === 'on' ? 'Stop' : 'Start'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Zone Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            {selectedZone.name} - Today's Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={selectedZone.sensorHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Area
                type="monotone"
                dataKey="moisture"
                stroke="hsl(var(--farmer))"
                fill="hsl(var(--farmer) / 0.2)"
                name="Moisture %"
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--accent))"
                fill="hsl(var(--accent) / 0.1)"
                name="Temp °C"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Droplets className="h-3 w-3 text-farmer" /> Moisture
            </span>
            <span className="flex items-center gap-1">
              <Thermometer className="h-3 w-3 text-accent" /> Temperature
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Irrigation Info */}
      <Card className="bg-farmer/5 border-farmer/30">
        <CardContent className="p-4">
          <p className="font-semibold text-foreground text-sm mb-2">🤖 How Auto-Irrigation Works</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Soil sensors monitor moisture levels every 15 minutes</li>
            <li>• When moisture drops below optimal range, pump turns ON automatically</li>
            <li>• Pump turns OFF when optimal moisture level is reached</li>
            <li>• Weather data is considered to avoid watering before rain</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
