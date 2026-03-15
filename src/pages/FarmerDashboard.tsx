import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
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
import { ShoppingBag, Users, Plus, Package, Briefcase, IndianRupee, Tractor, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { SmartFarmingTools } from '@/components/farmer/SmartFarmingTools';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
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

  useEffect(() => {
    const crops = getAllCrops().filter((c) => c.farmerId === user?.id);
    const jobs = getAllWorkerJobs().filter((j) => j.farmerId === user?.id);
    const vehicles = getAllVehicles();
    setMyCrops(crops);
    setMyJobs(jobs);
    setMyVehicles(vehicles.filter((v) => v.ownerId === user?.id));
    setAllVehicles(vehicles);
  }, [user?.id]);

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
        description: t('farmer.soldCrop', { name: crop.name }),
        amount: crop.pricePerUnit * crop.quantity,
        quantity: crop.quantity,
        unit: crop.unit,
        cropName: crop.name,
        date: new Date(),
      };
      setMyTransactions([newTransaction, ...myTransactions]);
    }
    toast.success(t('farmer.cropMarkedSold'));
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
    toast.success(t('farmer.transactionAdded'));
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
    toast.success(t('farmer.vehicleAdded'));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <LivePriceTicker prices={mockCropPrices} selectedCrop={myCrops[0]?.name} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="sell" className="flex items-center gap-1 text-xs sm:text-sm">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.sellCrops')}</span>
              <span className="sm:hidden">{t('dashboard.sell')}</span>
            </TabsTrigger>
            <TabsTrigger value="smart" className="flex items-center gap-1 text-xs sm:text-sm">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.smartTools')}</span>
              <span className="sm:hidden">{t('dashboard.smart')}</span>
            </TabsTrigger>
            <TabsTrigger value="hire" className="flex items-center gap-1 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.hire')}</span>
              <span className="sm:hidden">{t('dashboard.hire')}</span>
            </TabsTrigger>
            <TabsTrigger value="machinery" className="flex items-center gap-1 text-xs sm:text-sm">
              <Tractor className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.machinery')}</span>
              <span className="sm:hidden">{t('dashboard.rent')}</span>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-1 text-xs sm:text-sm">
              <IndianRupee className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.accounts')}</span>
              <span className="sm:hidden">{t('dashboard.pl')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sell" className="space-y-4 animate-fade-in">
            {showSellForm ? (
              <SellCropForm onSubmit={handleAddCrop} onCancel={() => setShowSellForm(false)} />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">{t('dashboard.myListedCrops')}</h2>
                  <Button onClick={() => setShowSellForm(true)} className="bg-farmer hover:bg-farmer/90">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('dashboard.addCrop')}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Package className="h-6 w-6 mx-auto text-farmer mb-2" />
                      <p className="text-2xl font-bold text-foreground">{myCrops.filter((c) => c.status === 'available').length}</p>
                      <p className="text-xs text-muted-foreground">{t('common.available')}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Briefcase className="h-6 w-6 mx-auto text-warning mb-2" />
                      <p className="text-2xl font-bold text-foreground">{myCrops.filter((c) => c.status === 'in_discussion').length}</p>
                      <p className="text-xs text-muted-foreground">{t('dashboard.inDiscussion')}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <ShoppingBag className="h-6 w-6 mx-auto text-success mb-2" />
                      <p className="text-2xl font-bold text-foreground">{myCrops.filter((c) => c.status === 'sold').length}</p>
                      <p className="text-xs text-muted-foreground">{t('dashboard.sold')}</p>
                    </CardContent>
                  </Card>
                </div>
                <MyCropsList crops={myCrops} onMarkAsSold={handleMarkAsSold} />
              </>
            )}
          </TabsContent>

          <TabsContent value="smart" className="animate-fade-in">
            <SmartFarmingTools />
          </TabsContent>

          <TabsContent value="hire" className="animate-fade-in">
            <HireSection userRole="farmer" myJobs={myJobs} onAddJob={handleAddJob} />
          </TabsContent>

          <TabsContent value="machinery" className="space-y-4 animate-fade-in">
            {showVehicleForm ? (
              <AddVehicleForm onSubmit={handleAddVehicle} onCancel={() => setShowVehicleForm(false)} userRole="farmer" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{t('dashboard.rentMachinery')}</h2>
                    <p className="text-muted-foreground text-sm">{t('dashboard.findTractorsAndMore')}</p>
                  </div>
                  <Button onClick={() => setShowVehicleForm(true)} className="bg-farmer hover:bg-farmer/90">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('dashboard.listYourVehicle')}
                  </Button>
                </div>
                {myVehicles.length > 0 && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{t('dashboard.myVehiclesForRent')}</h3>
                      <div className="space-y-2">
                        {myVehicles.map((v) => (
                          <div key={v.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="capitalize">{v.name} ({v.type.replace('_', ' ')})</span>
                            <span className="text-farmer font-bold">₹{v.pricePerDay}/{t('common.perDay')}</span>
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

          <TabsContent value="accounts" className="space-y-4 animate-fade-in">
            <ProfitLossCard transactions={myTransactions} userRole="farmer" />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">{t('dashboard.transactions')}</h2>
              <Button onClick={() => setShowTransactionForm(true)} className="bg-farmer hover:bg-farmer/90">
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.addTransaction')}
              </Button>
            </div>
            {showTransactionForm ? (
              <AddTransactionForm onSubmit={handleAddTransaction} onCancel={() => setShowTransactionForm(false)} userRole="farmer" />
            ) : (
              <TransactionList transactions={myTransactions} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
