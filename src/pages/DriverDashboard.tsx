import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { ProfitLossCard } from '@/components/shared/ProfitLossCard';
import { TransactionList } from '@/components/shared/TransactionList';
import { AddTransactionForm } from '@/components/shared/AddTransactionForm';
import { AddVehicleForm } from '@/components/shared/AddVehicleForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockDriverJobs } from '@/data/mockData';
import { getAllVehicles, addVehicle } from '@/data/sharedStore';
import { DriverJob, Transaction, Vehicle } from '@/types';
import { Calendar, Truck, Weight, Bell, BellOff, CheckCircle, Navigation, IndianRupee, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function DriverDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('trips');
  const [isAvailable, setIsAvailable] = useState(true);
  const [myLocation, setMyLocation] = useState(user?.location || '');
  const [vehicleType, setVehicleType] = useState('Truck');
  const [acceptedJobs, setAcceptedJobs] = useState<string[]>([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const vehicles = getAllVehicles().filter((v) => v.ownerId === user?.id);
    setMyVehicles(vehicles);
  }, [user?.id]);

  const nearbyJobs = mockDriverJobs.filter(
    (job) => job.status === 'open' && job.pickupLocation.toLowerCase().includes(myLocation.toLowerCase().split(',')[0])
  );

  const handleAccept = (job: DriverJob) => {
    setAcceptedJobs([...acceptedJobs, job.id]);
    const estimatedFare = job.weight * 2;
    const newTransaction: Transaction = {
      id: Date.now().toString(), userId: user?.id || '3', type: 'income',
      description: `Trip: ${job.pickupLocation} to ${job.dropLocation}`,
      amount: estimatedFare, partyName: 'Trip accepted', date: new Date(),
    };
    setMyTransactions([newTransaction, ...myTransactions]);
    toast.success(t('driver.jobAccepted'));
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    toast.success(isAvailable ? t('driver.markedUnavailable') : t('driver.markedAvailable'));
  };

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'userId' | 'date'>) => {
    const newTransaction: Transaction = { id: Date.now().toString(), userId: user?.id || '3', ...data, date: new Date() };
    setMyTransactions([newTransaction, ...myTransactions]);
    setShowTransactionForm(false);
    toast.success(t('farmer.transactionAdded'));
  };

  const handleAddVehicle = (data: Omit<Vehicle, 'id' | 'ownerId' | 'ownerName' | 'createdAt'>) => {
    const newVehicle: Vehicle = { id: Date.now().toString(), ownerId: user?.id || '3', ownerName: user?.name || 'Unknown', ...data, createdAt: new Date() };
    addVehicle(newVehicle);
    setMyVehicles([newVehicle, ...myVehicles]);
    setShowVehicleForm(false);
    toast.success(t('farmer.vehicleAdded'));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6 border-driver/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isAvailable ? <Bell className="h-5 w-5 text-driver" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
                <div>
                  <p className="font-medium text-foreground">{isAvailable ? t('driver.availableForTrips') : t('driver.notAvailable')}</p>
                  <p className="text-sm text-muted-foreground">{isAvailable ? t('driver.canReceiveTrips') : t('driver.noTripNotifications')}</p>
                </div>
              </div>
              <Switch checked={isAvailable} onCheckedChange={toggleAvailability} />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="trips" className="flex items-center gap-1 text-xs sm:text-sm">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.findTrips')}</span>
              <span className="sm:hidden">{t('dashboard.trips')}</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-1 text-xs sm:text-sm">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.myVehicles')}</span>
              <span className="sm:hidden">{t('dashboard.vehicles')}</span>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-1 text-xs sm:text-sm">
              <IndianRupee className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.earnings')}</span>
              <span className="sm:hidden">{t('dashboard.pl')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trips" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('driver.yourDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('driver.currentLocation')}</label>
                    <Input placeholder={t('driver.enterLocation')} value={myLocation} onChange={(e) => setMyLocation(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('driver.vehicleType')}</label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mini Truck">{t('driver.miniTruck')}</SelectItem>
                        <SelectItem value="Truck">{t('driver.truck')}</SelectItem>
                        <SelectItem value="Lorry">{t('driver.lorry')}</SelectItem>
                        <SelectItem value="Container">{t('driver.container')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button variant="outline" onClick={() => toast.success(t('driver.profileUpdated'))}>
                  {t('driver.updateProfile')}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">{t('driver.availableTrips')}</h2>
                <Badge variant="outline">{t('driver.tripsCount', { count: nearbyJobs.length })}</Badge>
              </div>

              {nearbyJobs.length === 0 ? (
                <Card className="p-8 text-center">
                  <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">{t('driver.noTripsAvailable')}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('driver.updateLocationOrCheckLater')}</p>
                </Card>
              ) : (
                nearbyJobs.map((job) => (
                  <Card key={job.id} className={acceptedJobs.includes(job.id) ? 'border-success/50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-success" />
                            <span className="font-medium text-foreground">{job.pickupLocation}</span>
                          </div>
                          <div className="ml-1.5 border-l-2 border-dashed border-muted h-4" />
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-destructive" />
                            <span className="font-medium text-foreground">{job.dropLocation}</span>
                          </div>
                        </div>
                        <Navigation className="h-8 w-8 text-driver" />
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{format(job.date, 'MMM dd, yyyy')}</div>
                        <div className="flex items-center gap-1"><Truck className="h-4 w-4" />{job.vehicleType}</div>
                        <div className="flex items-center gap-1"><Weight className="h-4 w-4" />{job.weight} kg</div>
                      </div>
                      {acceptedJobs.includes(job.id) ? (
                        <Button disabled className="w-full bg-success"><CheckCircle className="h-4 w-4 mr-2" />{t('driver.accepted')}</Button>
                      ) : (
                        <Button onClick={() => handleAccept(job)} className="w-full bg-driver hover:bg-driver/90">{t('driver.acceptTrip')}</Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4 animate-fade-in">
            {showVehicleForm ? (
              <AddVehicleForm onSubmit={handleAddVehicle} onCancel={() => setShowVehicleForm(false)} userRole="driver" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{t('dashboard.myVehicles')}</h2>
                    <p className="text-muted-foreground text-sm">{t('worker.listVehiclesForRent')}</p>
                  </div>
                  <Button onClick={() => setShowVehicleForm(true)} className="bg-driver hover:bg-driver/90">
                    <Plus className="h-4 w-4 mr-2" />{t('driver.addVehicle')}
                  </Button>
                </div>
                {myVehicles.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">{t('driver.noVehiclesListed')}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t('driver.addVehiclesForIncome')}</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {myVehicles.map((v) => (
                      <Card key={v.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold capitalize">{v.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">{v.type.replace('_', ' ')}</p>
                              <p className="text-xs text-muted-foreground">{v.location}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-driver">₹{v.pricePerDay}</p>
                              <p className="text-xs text-muted-foreground">{t('common.perDay')}</p>
                              <Badge variant={v.available ? 'default' : 'secondary'} className="mt-1">
                                {v.available ? t('common.available') : t('common.rented')}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4 animate-fade-in">
            <ProfitLossCard transactions={myTransactions} userRole="driver" />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">{t('dashboard.earnings')}</h2>
              <Button onClick={() => setShowTransactionForm(true)} className="bg-driver hover:bg-driver/90">
                <Plus className="h-4 w-4 mr-2" />{t('dashboard.addEntry')}
              </Button>
            </div>
            {showTransactionForm ? (
              <AddTransactionForm onSubmit={handleAddTransaction} onCancel={() => setShowTransactionForm(false)} userRole="driver" />
            ) : (
              <TransactionList transactions={myTransactions} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
