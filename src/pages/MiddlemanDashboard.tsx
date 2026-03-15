import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('buy');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [myJobs, setMyJobs] = useState<WorkerJob[]>([]);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>(mockTransactions.filter((t) => t.userId === '2'));
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [allCrops, setAllCrops] = useState<Crop[]>([]);

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
    const newJob: WorkerJob = { id: Date.now().toString(), farmerId: user?.id || '2', ...data, status: 'open' };
    addWorkerJob(newJob);
    setMyJobs([newJob, ...myJobs]);
    toast.success(t('farmer.jobPosted'));
  };

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'userId' | 'date'>) => {
    const newTransaction: Transaction = { id: Date.now().toString(), userId: user?.id || '2', ...data, date: new Date() };
    setMyTransactions([newTransaction, ...myTransactions]);
    setShowTransactionForm(false);
    toast.success(t('farmer.transactionAdded'));
  };

  const handleAddVehicle = (data: Omit<Vehicle, 'id' | 'ownerId' | 'ownerName' | 'createdAt'>) => {
    const newVehicle: Vehicle = { id: Date.now().toString(), ownerId: user?.id || '2', ownerName: user?.name || 'Unknown', ...data, createdAt: new Date() };
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
          <LivePriceTicker prices={mockCropPrices} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="buy" className="flex items-center gap-1 text-xs sm:text-sm">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.buyCrops')}</span>
              <span className="sm:hidden">{t('dashboard.buy')}</span>
            </TabsTrigger>
            <TabsTrigger value="hire" className="flex items-center gap-1 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.hire')}</span>
              <span className="sm:hidden">{t('dashboard.hire')}</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-1 text-xs sm:text-sm">
              <Tractor className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.vehicles')}</span>
              <span className="sm:hidden">{t('dashboard.rent')}</span>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-1 text-xs sm:text-sm">
              <IndianRupee className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.accounts')}</span>
              <span className="sm:hidden">{t('dashboard.pl')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="animate-fade-in">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">{t('dashboard.findCropsToBuy')}</h2>
              <p className="text-muted-foreground">{t('dashboard.searchByLocationAndType')}</p>
            </div>
            <CropSearch crops={allCrops} />
          </TabsContent>

          <TabsContent value="hire" className="animate-fade-in">
            <HireSection userRole="middleman" myJobs={myJobs} onAddJob={handleAddJob} />
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4 animate-fade-in">
            {showVehicleForm ? (
              <AddVehicleForm onSubmit={handleAddVehicle} onCancel={() => setShowVehicleForm(false)} userRole="middleman" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{t('dashboard.rentVehicles')}</h2>
                    <p className="text-muted-foreground text-sm">{t('dashboard.findTrucksAndTransport')}</p>
                  </div>
                  <Button onClick={() => setShowVehicleForm(true)} className="bg-middleman hover:bg-middleman/90">
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
                            <span className="text-middleman font-bold">₹{v.pricePerDay}/{t('common.perDay')}</span>
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
            <ProfitLossCard transactions={myTransactions} userRole="middleman" />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">{t('dashboard.transactions')}</h2>
              <Button onClick={() => setShowTransactionForm(true)} className="bg-middleman hover:bg-middleman/90">
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.addTransaction')}
              </Button>
            </div>
            {showTransactionForm ? (
              <AddTransactionForm onSubmit={handleAddTransaction} onCancel={() => setShowTransactionForm(false)} userRole="middleman" />
            ) : (
              <TransactionList transactions={myTransactions} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
