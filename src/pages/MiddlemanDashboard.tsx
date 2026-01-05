import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { LivePriceTicker } from '@/components/shared/LivePriceTicker';
import { CropSearch } from '@/components/middleman/CropSearch';
import { HireSection } from '@/components/shared/HireSection';
import { ProfitLossCard } from '@/components/shared/ProfitLossCard';
import { TransactionList } from '@/components/shared/TransactionList';
import { AddTransactionForm } from '@/components/shared/AddTransactionForm';
import { VehicleRentalList } from '@/components/shared/VehicleRentalList';
import { AddVehicleForm } from '@/components/shared/AddVehicleForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockCropPrices, mockTransactions } from '@/data/mockData';
import { getAllCrops, getAllWorkerJobs, addWorkerJob, getAllVehicles, addVehicle } from '@/data/sharedStore';
import { Crop, WorkerJob, Transaction, Vehicle } from '@/types';
import { ShoppingCart, Users, IndianRupee, Tractor, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function MiddlemanDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('buy');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [myJobs, setMyJobs] = useState<WorkerJob[]>([]);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>(
    mockTransactions.filter((t) => t.userId === '2')
  );
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [allCrops, setAllCrops] = useState<Crop[]>([]);

  // Load data from shared store
  useEffect(() => {
    const crops = getAllCrops();
    const jobs = getAllWorkerJobs().filter((j) => j.farmerId === user?.id);
    const vehicles = getAllVehicles();
    setAllCrops(crops);
    setMyJobs(jobs);
    setMyVehicles(vehicles.filter((v) => v.ownerId === user?.id));
    setAllVehicles(vehicles);
  }, [user?.id]);

  const handleAddJob = (data: any) => {
    const newJob: WorkerJob = {
      id: Date.now().toString(),
      farmerId: user?.id || '2',
      ...data,
      status: 'open',
    };
    addWorkerJob(newJob);
    setMyJobs([newJob, ...myJobs]);
    toast.success('Job posted successfully!');
  };

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'userId' | 'date'>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user?.id || '2',
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
      ownerId: user?.id || '2',
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
          <LivePriceTicker prices={mockCropPrices} />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="buy" className="flex items-center gap-1 text-xs sm:text-sm">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Buy Crops</span>
              <span className="sm:hidden">Buy</span>
            </TabsTrigger>
            <TabsTrigger value="hire" className="flex items-center gap-1 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Hire</span>
              <span className="sm:hidden">Hire</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-1 text-xs sm:text-sm">
              <Tractor className="h-4 w-4" />
              <span className="hidden sm:inline">Vehicles</span>
              <span className="sm:hidden">Rent</span>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-1 text-xs sm:text-sm">
              <IndianRupee className="h-4 w-4" />
              <span className="hidden sm:inline">Accounts</span>
              <span className="sm:hidden">P&L</span>
            </TabsTrigger>
          </TabsList>

          {/* Buy Crops Tab */}
          <TabsContent value="buy" className="animate-fade-in">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Find Crops to Buy</h2>
              <p className="text-muted-foreground">Search by location and crop type</p>
            </div>
            <CropSearch crops={allCrops} />
          </TabsContent>

          {/* Hire Tab */}
          <TabsContent value="hire" className="animate-fade-in">
            <HireSection
              userRole="middleman"
              myJobs={myJobs}
              onAddJob={handleAddJob}
            />
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-4 animate-fade-in">
            {showVehicleForm ? (
              <AddVehicleForm
                onSubmit={handleAddVehicle}
                onCancel={() => setShowVehicleForm(false)}
                userRole="middleman"
              />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Rent Vehicles</h2>
                    <p className="text-muted-foreground text-sm">Find trucks & transport vehicles</p>
                  </div>
                  <Button onClick={() => setShowVehicleForm(true)} className="bg-middleman hover:bg-middleman/90">
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
                            <span className="text-middleman font-bold">₹{v.pricePerDay}/day</span>
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
            <ProfitLossCard transactions={myTransactions} userRole="middleman" />

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Transactions</h2>
              <Button onClick={() => setShowTransactionForm(true)} className="bg-middleman hover:bg-middleman/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>

            {showTransactionForm ? (
              <AddTransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => setShowTransactionForm(false)}
                userRole="middleman"
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
