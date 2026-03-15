import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { mockIrrigationZones, IrrigationZone } from '@/data/smartFarmingData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, Thermometer, Power, Clock, Gauge, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function IotDashboard() {
  const { t } = useTranslation();
  const [zones, setZones] = useState(mockIrrigationZones);
  const [selectedZone, setSelectedZone] = useState<IrrigationZone>(zones[0]);

  const togglePump = (zoneId: string) => {
    setZones(prev => prev.map(z => {
      if (z.id === zoneId) {
        const newStatus = z.pumpStatus === 'on' ? 'off' : 'on';
        toast.success(t('farming.pumpTurnedOn', { zone: z.name }).replace('ON', newStatus.toUpperCase()));
        return { ...z, pumpStatus: newStatus as 'on' | 'off' };
      }
      return z;
    }));
    setSelectedZone(prev => prev.id === zoneId ? { ...prev, pumpStatus: prev.pumpStatus === 'on' ? 'off' : 'on' } : prev);
  };

  const toggleAuto = (zoneId: string) => {
    setZones(prev => prev.map(z => {
      if (z.id === zoneId) {
        const newStatus = z.pumpStatus === 'auto' ? 'off' : 'auto';
        toast.success(newStatus === 'auto' ? t('farming.autoEnabled', { zone: z.name }) : t('farming.autoDisabled', { zone: z.name }));
        return { ...z, pumpStatus: newStatus as 'auto' | 'off' };
      }
      return z;
    }));
    setSelectedZone(prev => prev.id === zoneId ? { ...prev, pumpStatus: prev.pumpStatus === 'auto' ? 'off' : 'auto' } : prev);
  };

  const getMoistureStatus = (zone: IrrigationZone) => {
    if (zone.currentMoisture < zone.optimalMoistureMin) return { label: t('farming.low'), color: 'text-destructive' };
    if (zone.currentMoisture > zone.optimalMoistureMax) return { label: t('farming.high'), color: 'text-blue-500' };
    return { label: t('farming.optimal'), color: 'text-success' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{t('farming.smartIrrigation')}</h2>
        <Badge variant="outline" className="text-xs">{t('farming.active', { count: zones.filter(z => z.pumpStatus === 'on' || z.pumpStatus === 'auto').length })}</Badge>
      </div>

      <div className="grid gap-3">
        {zones.map(zone => {
          const status = getMoistureStatus(zone);
          const isSelected = selectedZone.id === zone.id;
          const needsWater = zone.currentMoisture < zone.optimalMoistureMin;

          return (
            <Card key={zone.id} className={`cursor-pointer transition-all ${isSelected ? 'border-farmer ring-1 ring-farmer/30' : ''} ${needsWater ? 'border-destructive/30' : ''}`} onClick={() => setSelectedZone(zone)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{zone.name}</p>
                    <p className="text-xs text-muted-foreground">{zone.crop} • {zone.area}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {needsWater && <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />}
                    <Badge className={`text-xs ${zone.pumpStatus === 'on' ? 'bg-success text-success-foreground' : zone.pumpStatus === 'auto' ? 'bg-farmer text-farmer-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {zone.pumpStatus === 'auto' ? t('farming.autoIrrigation') : zone.pumpStatus === 'on' ? t('farming.pumpOn') : t('farming.pumpOff')}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t('farming.soilMoisture')}</span>
                    <span className={`font-semibold ${status.color}`}>{zone.currentMoisture}% ({status.label})</span>
                  </div>
                  <Progress value={zone.currentMoisture} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('farming.min')}: {zone.optimalMoistureMin}%</span>
                    <span>{t('farming.max')}: {zone.optimalMoistureMax}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />{t('farming.watered', { time: zone.lastWatered })}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">{t('farming.auto')}</span>
                      <Switch checked={zone.pumpStatus === 'auto'} onCheckedChange={() => toggleAuto(zone.id)} onClick={(e) => e.stopPropagation()} />
                    </div>
                    <Button size="sm" variant={zone.pumpStatus === 'on' ? 'destructive' : 'default'} className={zone.pumpStatus !== 'on' ? 'bg-farmer hover:bg-farmer/90' : ''} onClick={(e) => { e.stopPropagation(); togglePump(zone.id); }} disabled={zone.pumpStatus === 'auto'}>
                      <Power className="h-3 w-3 mr-1" />{zone.pumpStatus === 'on' ? t('farming.stop') : t('farming.start')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Gauge className="h-4 w-4" />{t('farming.todaysData', { zone: selectedZone.name })}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={selectedZone.sensorHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
              <Area type="monotone" dataKey="moisture" stroke="hsl(var(--farmer))" fill="hsl(var(--farmer) / 0.2)" name={t('farming.moisture')} />
              <Area type="monotone" dataKey="temperature" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.1)" name={t('farming.temperature')} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Droplets className="h-3 w-3 text-farmer" /> {t('farming.moisture')}</span>
            <span className="flex items-center gap-1"><Thermometer className="h-3 w-3 text-accent" /> {t('farming.temperature')}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-farmer/5 border-farmer/30">
        <CardContent className="p-4">
          <p className="font-semibold text-foreground text-sm mb-2">{t('farming.howAutoIrrigationWorks')}</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• {t('farming.autoTip1')}</li>
            <li>• {t('farming.autoTip2')}</li>
            <li>• {t('farming.autoTip3')}</li>
            <li>• {t('farming.autoTip4')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
