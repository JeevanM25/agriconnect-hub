import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { LivePriceTicker } from '@/components/shared/LivePriceTicker';
import { SellCropForm } from '@/components/farmer/SellCropForm';
import { MyCropsList } from '@/components/farmer/MyCropsList';
import { HireSection } from '@/components/shared/HireSection';
import { ProfitLossCard } from '@/components/shared/ProfitLossCard';
import { TransactionList } from '@/components/shared/TransactionList';
import { AddTransactionForm } from '@/components/shared/AddTransactionForm';
import { VehicleRentalList } from '@/components/shared/VehicleRentalList';
import { AddVehicleForm } from '@/components/shared/AddVehicleForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCropPrices, mockTransactions } from '@/data/mockData';
import { getAllCrops, addCrop, updateCrop, getAllWorkerJobs, addWorkerJob, getAllVehicles, addVehicle } from '@/data/sharedStore';
import { Crop, WorkerJob, Transaction, Vehicle } from '@/types';
import { ShoppingBag, Users, Plus, Package, Briefcase, IndianRupee, Tractor } from 'lucide-react';
import { toast } from 'sonner';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sell');
  const [showSellForm, setShowSellForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [myCrops, setMyCrops] = useState<Crop[]>([]);
  const [myJobs, setMyJobs] = useState<WorkerJob[]>([]);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>(
    mockTransactions.filter((t) => t.userId === '1')
  );
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);

  // Load data from shared store
  useEffect(() => {
    const crops = getAllCrops().filter((c) => c.farmerId === user?.id);
    const jobs = getAllWorkerJobs().filter((j) => j.farmerId === user?.id);
    const vehicles = getAllVehicles();
    setMyCrops(crops);
    setMyJobs(jobs);
    setMyVehicles(vehicles.filter((v) => v.ownerId === user?.id));
    setAllVehicles(vehicles);
  }, [user?.id]);

  // Get crop names for price ticker
  const selectedCropNames = myCrops.map((c) => c.name.toLowerCase());

  const handleAddCrop = (data: any) => {
    const newCrop: Crop = {
      id: Date.now().toString(),
      farmerId: user?.id || '1',
      farmerName: user?.name || 'Unknown',
      ...data,
      status: 'available',
      createdAt: new Date(),
    };
    addCrop(newCrop);
    setMyCrops([newCrop, ...myCrops]);
    setShowSellForm(false);
  };

  const handleMarkAsSold = (cropId: string) => {
    const crop = myCrops.find((c) => c.id === cropId);
    updateCrop(cropId, { status: 'sold' });
    setMyCrops(myCrops.map((c) => (c.id === cropId ? { ...c, status: 'sold' as const } : c)));
    
    if (crop) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        userId: user?.id || '1',
        type: 'sale',
        description: `Sold ${crop.name}`,
        amount: crop.pricePerUnit * crop.quantity,
        quantity: crop.quantity,
        unit: crop.unit,
        cropName: crop.name,
        date: new Date(),
      };
      setMyTransactions([newTransaction, ...myTransactions]);
    }
    toast.success('Crop marked as sold!');
  };

  const handleAddJob = (data: any) => {
    const newJob: WorkerJob = {
      id: Date.now().toString(),
      farmerId: user?.id || '1',
      ...data,
      status: 'open',
    };
    addWorkerJob(newJob);
    setMyJobs([newJob, ...myJobs]);
  };

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'userId' | 'date'>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      ...data,
      date: new Date(),
    };
    setMyTransactions([newTransaction, ...myTransactions]);
    setShowTransactionForm(false);
    toast.success('Transaction added!');
  };

  const handleAddVehicle = (data: Omit<Vehicle, 'id' | 'ownerId' | 'ownerName' | 'createdAt'>) => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      ownerId: user?.id || '1',
      ownerName: user?.name || 'Unknown',
      ...data,
      createdAt: new Date(),
    };
    addVehicle(newVehicle);
    setMyVehicles([newVehicle, ...myVehicles]);
    setAllVehicles([newVehicle, ...allVehicles]);
    setShowVehicleForm(false);
    toast.success('Vehicle added for rent!');
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Live Price Ticker */}
        <div className="mb-6">
          <LivePriceTicker 
            prices={mockCropPrices} 
            selectedCrop={myCrops[0]?.name} 
          />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="sell" className="flex items-center gap-1 text-xs sm:text-sm">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Sell Crops</span>
              <span className="sm:hidden">Sell</span>
            </TabsTrigger>
            <TabsTrigger value="hire" className="flex items-center gap-1 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Hire</span>
              <span className="sm:hidden">Hire</span>
            </TabsTrigger>
            <TabsTrigger value="machinery" className="flex items-center gap-1 text-xs sm:text-sm">
              <Tractor className="h-4 w-4" />
              <span className="hidden sm:inline">Machinery</span>
              <span className="sm:hidden">Rent</span>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-1 text-xs sm:text-sm">
              <IndianRupee className="h-4 w-4" />
              <span className="hidden sm:inline">Accounts</span>
              <span className="sm:hidden">P&L</span>
            </TabsTrigger>
          </TabsList>

          {/* Sell Crops Tab */}
          <TabsContent value="sell" className="space-y-4 animate-fade-in">
            {showSellForm ? (
              <SellCropForm onSubmit={handleAddCrop} onCancel={() => setShowSellForm(false)} />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">My Listed Crops</h2>
                  <Button onClick={() => setShowSellForm(true)} className="bg-farmer hover:bg-farmer/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Crop
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Package className="h-6 w-6 mx-auto text-farmer mb-2" />
                      <p className="text-2xl font-bold text-foreground">
                        {myCrops.filter((c) => c.status === 'available').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Briefcase className="h-6 w-6 mx-auto text-warning mb-2" />
                      <p className="text-2xl font-bold text-foreground">
                        {myCrops.filter((c) => c.status === 'in_discussion').length}
                      </p>
                      <p className="text-xs text-muted-foreground">In Discussion</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <ShoppingBag className="h-6 w-6 mx-auto text-success mb-2" />
                      <p className="text-2xl font-bold text-foreground">
                        {myCrops.filter((c) => c.status === 'sold').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Sold</p>
                    </CardContent>
                  </Card>
                </div>

                <MyCropsList crops={myCrops} onMarkAsSold={handleMarkAsSold} />
              </>
            )}
          </TabsContent>

          {/* Hire Tab */}
          <TabsContent value="hire" className="animate-fade-in">
            <HireSection
              userRole="farmer"
              myJobs={myJobs}
              onAddJob={handleAddJob}
            />
          </TabsContent>

          {/* Machinery Tab */}
          <TabsContent value="machinery" className="space-y-4 animate-fade-in">
            {showVehicleForm ? (
              <AddVehicleForm
                onSubmit={handleAddVehicle}
                onCancel={() => setShowVehicleForm(false)}
                userRole="farmer"
              />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Rent Machinery</h2>
                    <p className="text-muted-foreground text-sm">Find tractors, harvesters & more</p>
                  </div>
                  <Button onClick={() => setShowVehicleForm(true)} className="bg-farmer hover:bg-farmer/90">
                    <Plus className="h-4 w-4 mr-2" />
                    List Your Vehicle
                  </Button>
                </div>

                {/* My Vehicles */}
                {myVehicles.length > 0 && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">My Vehicles for Rent</h3>
                      <div className="space-y-2">
                        {myVehicles.map((v) => (
                          <div key={v.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="capitalize">{v.name} ({v.type.replace('_', ' ')})</span>
                            <span className="text-farmer font-bold">₹{v.pricePerDay}/day</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <VehicleRentalList vehicles={allVehicles} userLocation={user?.location} />
              </>
            )}
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-4 animate-fade-in">
            <ProfitLossCard transactions={myTransactions} userRole="farmer" />

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Transactions</h2>
              <Button onClick={() => setShowTransactionForm(true)} className="bg-farmer hover:bg-farmer/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>

            {showTransactionForm ? (
              <AddTransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => setShowTransactionForm(false)}
                userRole="farmer"
              />
            ) : (
              <TransactionList transactions={myTransactions} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
