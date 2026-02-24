import { useState } from 'react';
import { CropPrice } from '@/types';
import { TrendingUp, TrendingDown, Minus, Plus, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LivePriceTickerProps {
  prices: CropPrice[];
  selectedCrop?: string;
}

const STORAGE_KEY = 'farmx-watched-crops';

function getWatchedCrops(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWatchedCrops(crops: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
}

export function LivePriceTicker({ prices, selectedCrop }: LivePriceTickerProps) {
  const [watchedCrops, setWatchedCrops] = useState<string[]>(getWatchedCrops);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const availableCrops = prices.filter(
    (p) => !watchedCrops.includes(p.cropName) &&
      p.cropName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayPrices = watchedCrops.length > 0
    ? prices.filter((p) => watchedCrops.includes(p.cropName))
    : selectedCrop
      ? prices.filter((p) => p.cropName.toLowerCase() === selectedCrop.toLowerCase())
      : [];

  const addCrop = (cropName: string) => {
    const updated = [...watchedCrops, cropName];
    setWatchedCrops(updated);
    saveWatchedCrops(updated);
    setSearchQuery('');
    setShowSearch(false);
  };

  const removeCrop = (cropName: string) => {
    const updated = watchedCrops.filter((c) => c !== cropName);
    setWatchedCrops(updated);
    saveWatchedCrops(updated);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">My Watchlist</span>
          {watchedCrops.length > 0 && (
            <Badge variant="secondary" className="text-xs">{watchedCrops.length}</Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSearch(!showSearch)}
          className="h-7 text-xs gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Crop
        </Button>
      </div>

      {/* Search & Add */}
      {showSearch && (
        <div className="mb-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crop (e.g., Rice)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
              autoFocus
            />
          </div>
          {(searchQuery || availableCrops.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {availableCrops.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addCrop(p.cropName)}
                  className="px-2.5 py-1 text-xs rounded-full border border-border bg-muted/50 hover:bg-primary/10 hover:border-primary transition-colors text-foreground"
                >
                  + {p.cropName}
                </button>
              ))}
              {availableCrops.length === 0 && searchQuery && (
                <p className="text-xs text-muted-foreground py-1">No crops found</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Watched Prices */}
      {displayPrices.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {displayPrices.map((price) => (
            <div
              key={price.id}
              className="flex-shrink-0 p-3 rounded-lg border border-border bg-muted/30 relative group"
            >
              <button
                onClick={() => removeCrop(price.cropName)}
                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
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
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No crops in your watchlist</p>
          <p className="text-xs mt-1">Tap "Add Crop" to track prices you care about</p>
        </div>
      )}
    </div>
  );
}
