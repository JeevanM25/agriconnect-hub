import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockPestAlerts, PestAlert } from '@/data/smartFarmingData';
import { Bug, MapPin, AlertTriangle, Shield, ChevronDown, ChevronUp, Pill, Eye } from 'lucide-react';

const severityConfig = {
  critical: { color: 'bg-destructive text-destructive-foreground', label: 'Critical' },
  high: { color: 'bg-warning text-warning-foreground', label: 'High' },
  medium: { color: 'bg-accent text-accent-foreground', label: 'Medium' },
  low: { color: 'bg-muted text-muted-foreground', label: 'Low' },
};

export function PestAlertSystem() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedAlerts = [...mockPestAlerts].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">🚨 Pest Alerts</h2>
        <Badge variant="outline" className="text-xs">
          {mockPestAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length} active threats
        </Badge>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-2">
        {(['critical', 'high', 'medium', 'low'] as const).map(level => (
          <Card key={level} className="text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-foreground">
                {mockPestAlerts.filter(a => a.severity === level).length}
              </p>
              <Badge className={`text-xs mt-1 ${severityConfig[level].color}`}>
                {severityConfig[level].label}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {sortedAlerts.map((alert) => (
          <Card
            key={alert.id}
            className={`transition-all ${
              alert.severity === 'critical' ? 'border-destructive/50 bg-destructive/5' :
              alert.severity === 'high' ? 'border-warning/50 bg-warning/5' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Bug className={`h-5 w-5 mt-0.5 shrink-0 ${
                    alert.severity === 'critical' ? 'text-destructive' : 'text-warning'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground">{alert.pestName}</p>
                      <Badge className={`text-xs ${severityConfig[alert.severity].color}`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {alert.region} • {alert.distanceKm}km away
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {alert.affectedCrops.map(crop => (
                        <Badge key={crop} variant="outline" className="text-xs">{crop}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
                >
                  {expandedId === alert.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              {expandedId === alert.id && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  <p className="text-sm text-muted-foreground">{alert.description}</p>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1 mb-2">
                      <Eye className="h-3 w-3" /> Symptoms to Watch
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {alert.symptoms.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-farmer/10 rounded-lg">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
                      <Pill className="h-3 w-3" /> Treatment
                    </p>
                    <p className="text-xs text-muted-foreground">{alert.treatment}</p>
                  </div>

                  <div className="p-3 bg-accent/10 rounded-lg">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
                      <Shield className="h-3 w-3" /> Prevention
                    </p>
                    <p className="text-xs text-muted-foreground">{alert.preventiveMeasure}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
