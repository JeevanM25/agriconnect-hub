// Weather Forecast Mock Data
export interface WeatherDay {
  day: string;
  date: string;
  temp: number;
  tempMin: number;
  humidity: number;
  rainfall: number;
  wind: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly_cloudy';
  farmingTip: string;
}

export const mockWeatherForecast: WeatherDay[] = [
  { day: 'Today', date: 'Feb 24', temp: 32, tempMin: 22, humidity: 65, rainfall: 0, wind: 12, condition: 'sunny', farmingTip: 'Great day for harvesting and drying crops' },
  { day: 'Tue', date: 'Feb 25', temp: 30, tempMin: 21, humidity: 70, rainfall: 5, wind: 15, condition: 'partly_cloudy', farmingTip: 'Good for fertilizer application before rain' },
  { day: 'Wed', date: 'Feb 26', temp: 28, tempMin: 20, humidity: 80, rainfall: 25, wind: 20, condition: 'rainy', farmingTip: 'Avoid spraying pesticides today' },
  { day: 'Thu', date: 'Feb 27', temp: 27, tempMin: 19, humidity: 85, rainfall: 40, wind: 25, condition: 'stormy', farmingTip: '⚠️ Secure crops and equipment. Heavy rain expected' },
  { day: 'Fri', date: 'Feb 28', temp: 29, tempMin: 20, humidity: 75, rainfall: 10, wind: 18, condition: 'cloudy', farmingTip: 'Check drainage systems after heavy rain' },
  { day: 'Sat', date: 'Mar 1', temp: 31, tempMin: 21, humidity: 60, rainfall: 0, wind: 10, condition: 'sunny', farmingTip: 'Ideal for sowing and transplanting' },
  { day: 'Sun', date: 'Mar 2', temp: 33, tempMin: 23, humidity: 55, rainfall: 0, wind: 8, condition: 'sunny', farmingTip: 'Perfect for irrigation and field work' },
];

// Price Prediction Mock Data
export interface PriceHistory {
  cropName: string;
  data: { month: string; price: number; predicted?: boolean }[];
  currentPrice: number;
  predictedPrice: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  bestSellWindow: string;
}

export const mockPricePredictions: PriceHistory[] = [
  {
    cropName: 'Rice',
    data: [
      { month: 'Sep', price: 2100 }, { month: 'Oct', price: 2200 }, { month: 'Nov', price: 2350 },
      { month: 'Dec', price: 2400 }, { month: 'Jan', price: 2500 }, { month: 'Feb', price: 2550 },
      { month: 'Mar', price: 2700, predicted: true }, { month: 'Apr', price: 2850, predicted: true },
    ],
    currentPrice: 2550, predictedPrice: 2850, trend: 'up', confidence: 82,
    bestSellWindow: 'March - April',
  },
  {
    cropName: 'Wheat',
    data: [
      { month: 'Sep', price: 2400 }, { month: 'Oct', price: 2350 }, { month: 'Nov', price: 2300 },
      { month: 'Dec', price: 2280 }, { month: 'Jan', price: 2250 }, { month: 'Feb', price: 2200 },
      { month: 'Mar', price: 2150, predicted: true }, { month: 'Apr', price: 2100, predicted: true },
    ],
    currentPrice: 2200, predictedPrice: 2100, trend: 'down', confidence: 75,
    bestSellWindow: 'Sell now - prices declining',
  },
  {
    cropName: 'Tomato',
    data: [
      { month: 'Sep', price: 1800 }, { month: 'Oct', price: 2200 }, { month: 'Nov', price: 3500 },
      { month: 'Dec', price: 2800 }, { month: 'Jan', price: 2000 }, { month: 'Feb', price: 1500 },
      { month: 'Mar', price: 2200, predicted: true }, { month: 'Apr', price: 3000, predicted: true },
    ],
    currentPrice: 1500, predictedPrice: 3000, trend: 'up', confidence: 68,
    bestSellWindow: 'April (peak expected)',
  },
  {
    cropName: 'Onion',
    data: [
      { month: 'Sep', price: 1200 }, { month: 'Oct', price: 1500 }, { month: 'Nov', price: 2000 },
      { month: 'Dec', price: 2500 }, { month: 'Jan', price: 3000 }, { month: 'Feb', price: 3200 },
      { month: 'Mar', price: 2800, predicted: true }, { month: 'Apr', price: 2200, predicted: true },
    ],
    currentPrice: 3200, predictedPrice: 2200, trend: 'down', confidence: 78,
    bestSellWindow: 'Sell now - prices at peak',
  },
];

// Pest Alert Mock Data
export interface PestAlert {
  id: string;
  pestName: string;
  affectedCrops: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  region: string;
  description: string;
  symptoms: string[];
  treatment: string;
  preventiveMeasure: string;
  reportedDate: string;
  distanceKm: number;
}

export const mockPestAlerts: PestAlert[] = [
  {
    id: '1', pestName: 'Brown Plant Hopper', affectedCrops: ['Rice', 'Paddy'],
    severity: 'critical', region: 'Thanjavur, Tamil Nadu',
    description: 'Severe outbreak reported. Can cause complete crop loss if untreated.',
    symptoms: ['Yellowing of leaves', 'Hopper burn patches', 'Wilting plants'],
    treatment: 'Apply Imidacloprid 17.8% SL @ 100ml/acre or Thiamethoxam 25% WG @ 100g/acre',
    preventiveMeasure: 'Avoid excess nitrogen fertilizer. Maintain proper water management.',
    reportedDate: '2026-02-23', distanceKm: 15,
  },
  {
    id: '2', pestName: 'Fall Armyworm', affectedCrops: ['Maize', 'Corn', 'Sorghum'],
    severity: 'high', region: 'Coimbatore, Tamil Nadu',
    description: 'Spreading rapidly. Early detection and treatment essential.',
    symptoms: ['Ragged holes in leaves', 'Frass (excrement) in whorl', 'Window-pane feeding damage'],
    treatment: 'Spray Emamectin Benzoate 5% SG @ 80g/acre or Spinetoram 11.7% SC @ 100ml/acre',
    preventiveMeasure: 'Use pheromone traps. Encourage natural predators like Trichogramma.',
    reportedDate: '2026-02-22', distanceKm: 45,
  },
  {
    id: '3', pestName: 'Leaf Blight', affectedCrops: ['Wheat', 'Rice'],
    severity: 'medium', region: 'Salem, Tamil Nadu',
    description: 'Fungal disease spreading due to high humidity conditions.',
    symptoms: ['Brown lesions on leaves', 'V-shaped yellowing', 'Premature drying'],
    treatment: 'Apply Mancozeb 75% WP @ 2g/L or Propiconazole 25% EC @ 1ml/L',
    preventiveMeasure: 'Ensure proper spacing. Remove infected plant debris.',
    reportedDate: '2026-02-20', distanceKm: 80,
  },
  {
    id: '4', pestName: 'Whitefly', affectedCrops: ['Tomato', 'Cotton', 'Chili'],
    severity: 'low', region: 'Madurai, Tamil Nadu',
    description: 'Early signs detected. Monitor closely.',
    symptoms: ['White tiny flies on leaf undersides', 'Sticky honeydew', 'Sooty mold growth'],
    treatment: 'Spray Neem oil 5% or Yellow sticky traps',
    preventiveMeasure: 'Use reflective mulches. Avoid planting near infected fields.',
    reportedDate: '2026-02-21', distanceKm: 120,
  },
];

// IoT Irrigation Mock Data
export interface SoilSensorData {
  timestamp: string;
  moisture: number; // percentage
  temperature: number;
  ph: number;
}

export interface IrrigationZone {
  id: string;
  name: string;
  crop: string;
  area: string;
  currentMoisture: number;
  optimalMoistureMin: number;
  optimalMoistureMax: number;
  pumpStatus: 'on' | 'off' | 'auto';
  lastWatered: string;
  sensorHistory: SoilSensorData[];
}

export const mockIrrigationZones: IrrigationZone[] = [
  {
    id: '1', name: 'Zone A - North Field', crop: 'Rice', area: '2.5 acres',
    currentMoisture: 35, optimalMoistureMin: 60, optimalMoistureMax: 80,
    pumpStatus: 'auto', lastWatered: '6 hours ago',
    sensorHistory: [
      { timestamp: '6AM', moisture: 72, temperature: 24, ph: 6.5 },
      { timestamp: '8AM', moisture: 68, temperature: 26, ph: 6.5 },
      { timestamp: '10AM', moisture: 60, temperature: 29, ph: 6.4 },
      { timestamp: '12PM', moisture: 52, temperature: 32, ph: 6.4 },
      { timestamp: '2PM', moisture: 45, temperature: 34, ph: 6.3 },
      { timestamp: '4PM', moisture: 38, temperature: 31, ph: 6.3 },
      { timestamp: '6PM', moisture: 35, temperature: 28, ph: 6.4 },
    ],
  },
  {
    id: '2', name: 'Zone B - East Field', crop: 'Tomato', area: '1.5 acres',
    currentMoisture: 55, optimalMoistureMin: 50, optimalMoistureMax: 70,
    pumpStatus: 'off', lastWatered: '2 hours ago',
    sensorHistory: [
      { timestamp: '6AM', moisture: 45, temperature: 23, ph: 6.8 },
      { timestamp: '8AM', moisture: 42, temperature: 25, ph: 6.8 },
      { timestamp: '10AM', moisture: 38, temperature: 28, ph: 6.7 },
      { timestamp: '12PM', moisture: 35, temperature: 31, ph: 6.7 },
      { timestamp: '2PM', moisture: 40, temperature: 33, ph: 6.6 },
      { timestamp: '4PM', moisture: 50, temperature: 30, ph: 6.7 },
      { timestamp: '6PM', moisture: 55, temperature: 27, ph: 6.7 },
    ],
  },
  {
    id: '3', name: 'Zone C - South Field', crop: 'Wheat', area: '3 acres',
    currentMoisture: 62, optimalMoistureMin: 45, optimalMoistureMax: 65,
    pumpStatus: 'off', lastWatered: '4 hours ago',
    sensorHistory: [
      { timestamp: '6AM', moisture: 58, temperature: 22, ph: 7.0 },
      { timestamp: '8AM', moisture: 55, temperature: 24, ph: 7.0 },
      { timestamp: '10AM', moisture: 52, temperature: 27, ph: 6.9 },
      { timestamp: '12PM', moisture: 48, temperature: 30, ph: 6.9 },
      { timestamp: '2PM', moisture: 50, temperature: 32, ph: 6.8 },
      { timestamp: '4PM', moisture: 58, temperature: 29, ph: 6.9 },
      { timestamp: '6PM', moisture: 62, temperature: 26, ph: 6.9 },
    ],
  },
];
