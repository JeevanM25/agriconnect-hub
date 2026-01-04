import { CropPrice } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LivePriceTickerProps {
  prices: CropPrice[];
  selectedCrop?: string;
}

export function LivePriceTicker({ prices, selectedCrop }: LivePriceTickerProps) {
  const displayPrices = selectedCrop 
    ? prices.filter(p => p.cropName.toLowerCase() === selectedCrop.toLowerCase())
    : prices;

  return (
    <div className="bg-card border border-border rounded-xl p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-sm font-medium text-muted-foreground">Live Market Prices</span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {displayPrices.map((price) => (
          <div
            key={price.id}
            className={cn(
              'flex-shrink-0 p-3 rounded-lg border transition-all',
              selectedCrop?.toLowerCase() === price.cropName.toLowerCase()
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/30'
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground">{price.cropName}</span>
              {price.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : price.change < 0 ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">₹{price.price.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">/{price.unit}</span>
            </div>
            <div className={cn(
              'text-xs font-medium mt-1',
              price.change > 0 ? 'text-success' : price.change < 0 ? 'text-destructive' : 'text-muted-foreground'
            )}>
              {price.change > 0 ? '+' : ''}{price.change}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">{price.market}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
