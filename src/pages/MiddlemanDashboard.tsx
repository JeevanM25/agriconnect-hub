import { useState } from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { LivePriceTicker } from '@/components/shared/LivePriceTicker';
import { CropSearch } from '@/components/middleman/CropSearch';
import { DriverSearch } from '@/components/middleman/DriverSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCrops, mockCropPrices } from '@/data/mockData';
import { ShoppingCart, Truck } from 'lucide-react';

export default function MiddlemanDashboard() {
  const [activeTab, setActiveTab] = useState('buy');

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Live Price Ticker */}
        <div className="mb-6">
          <LivePriceTicker prices={mockCropPrices} />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="buy" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Buy Crops
            </TabsTrigger>
            <TabsTrigger value="hire" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Hire Drivers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="animate-fade-in">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Find Crops to Buy</h2>
              <p className="text-muted-foreground">Search by location and crop type</p>
            </div>
            <CropSearch crops={mockCrops} />
          </TabsContent>

          <TabsContent value="hire" className="animate-fade-in">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Find Transport</h2>
              <p className="text-muted-foreground">Search for drivers near you</p>
            </div>
            <DriverSearch />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
