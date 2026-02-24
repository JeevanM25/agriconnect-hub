import { useState } from 'react';
import { WeatherForecast } from '@/components/farmer/WeatherForecast';
import { PricePrediction } from '@/components/farmer/PricePrediction';
import { PestAlertSystem } from '@/components/farmer/PestAlertSystem';
import { IotDashboard } from '@/components/farmer/IotDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CloudSun, TrendingUp, Bug, Droplets } from 'lucide-react';

export function SmartFarmingTools() {
  const [activeSubTab, setActiveSubTab] = useState('weather');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">🧠 Smart Farming Tools</h2>

      {/* Sub-tab selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'weather', icon: <CloudSun className="h-4 w-4" />, label: 'Weather' },
          { id: 'prices', icon: <TrendingUp className="h-4 w-4" />, label: 'Prices' },
          { id: 'pests', icon: <Bug className="h-4 w-4" />, label: 'Pest Alerts' },
          { id: 'iot', icon: <Droplets className="h-4 w-4" />, label: 'Irrigation' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeSubTab === tab.id
                ? 'bg-farmer text-farmer-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      <div className="animate-fade-in">
        {activeSubTab === 'weather' && <WeatherForecast />}
        {activeSubTab === 'prices' && <PricePrediction />}
        {activeSubTab === 'pests' && <PestAlertSystem />}
        {activeSubTab === 'iot' && <IotDashboard />}
      </div>
    </div>
  );
}
