import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockPricePredictions, PriceHistory } from '@/data/smartFarmingData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar, Target, BarChart3 } from 'lucide-react';

const trendIcons = {
  up: <TrendingUp className="h-5 w-5 text-success" />,
  down: <TrendingDown className="h-5 w-5 text-destructive" />,
  stable: <Minus className="h-5 w-5 text-muted-foreground" />,
};

export function PricePrediction() {
  const [selectedCrop, setSelectedCrop] = useState<PriceHistory>(mockPricePredictions[0]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">📈 Price Prediction</h2>

      {/* Crop Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {mockPricePredictions.map((crop) => (
          <button
            key={crop.cropName}
            onClick={() => setSelectedCrop(crop)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCrop.cropName === crop.cropName
                ? 'bg-farmer text-farmer-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {crop.cropName}
            {crop.trend === 'up' ? ' ↑' : crop.trend === 'down' ? ' ↓' : ' →'}
          </button>
        ))}
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {selectedCrop.cropName} Price Trend (₹/quintal)
            </CardTitle>
            {trendIcons[selectedCrop.trend]}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={selectedCrop.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value: number, name: string, props: any) => [
                  `₹${value}`,
                  props.payload.predicted ? 'Predicted Price' : 'Actual Price'
                ]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--farmer))"
                strokeWidth={2}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.predicted) {
                    return (
                      <circle
                        key={`dot-${payload.month}`}
                        cx={cx} cy={cy} r={5}
                        fill="none"
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                      />
                    );
                  }
                  return <circle key={`dot-${payload.month}`} cx={cx} cy={cy} r={4} fill="hsl(var(--farmer))" />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-farmer inline-block rounded" /> Actual
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 border border-dashed border-accent inline-block rounded" /> Predicted
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Current Price</p>
            <p className="text-2xl font-bold text-foreground">₹{selectedCrop.currentPrice}</p>
            <p className="text-xs text-muted-foreground">/quintal</p>
          </CardContent>
        </Card>
        <Card className="border-accent/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Predicted Price</p>
            <p className={`text-2xl font-bold ${selectedCrop.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
              ₹{selectedCrop.predictedPrice}
            </p>
            <p className="text-xs text-muted-foreground">/quintal</p>
          </CardContent>
        </Card>
      </div>

      {/* Best Sell Window */}
      <Card className="bg-farmer/5 border-farmer/30">
        <CardContent className="p-4 flex items-start gap-3">
          <Target className="h-5 w-5 text-farmer shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Best Time to Sell</p>
            <p className="text-sm text-muted-foreground">{selectedCrop.bestSellWindow}</p>
            <Badge variant="outline" className="mt-2 text-xs">
              {selectedCrop.confidence}% confidence
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
