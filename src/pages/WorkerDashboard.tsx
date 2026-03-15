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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllWorkerJobs, getAllVehicles, addVehicle } from '@/data/sharedStore';
import { WorkerJob, Transaction, Vehicle } from '@/types';
import { MapPin, Calendar, Users, Bell, BellOff, CheckCircle, IndianRupee, Tractor, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('jobs');
  const [isAvailable, setIsAvailable] = useState(true);
  const [myLocation, setMyLocation] = useState(user?.location || '');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [allJobs, setAllJobs] = useState<WorkerJob[]>([]);

  useEffect(() => {
    const jobs = getAllWorkerJobs();
    const vehicles = getAllVehicles().filter((v) => v.ownerId === user?.id);
    setAllJobs(jobs);
    setMyVehicles(vehicles);
  }, [user?.id]);

  const nearbyJobs = allJobs.filter(
    (job) => job.status === 'open' && job.location.toLowerCase().includes(myLocation.toLowerCase().split(',')[0])
  );

  const handleApply = (job: WorkerJob) => {
    setAppliedJobs([...appliedJobs, job.id]);
    const newTransaction: Transaction = {
      id: Date.now().toString(), userId: user?.id || '4', type: 'income',
      description: `Applied: ${job.description}`, amount: job.pricePerDay * job.duration,
      partyName: 'Pending confirmation', date: new Date(),
    };
    setMyTransactions([newTransaction, ...myTransactions]);
    toast.success(t('worker.applicationSent'));
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    toast.success(isAvailable ? t('worker.markedUnavailable') : t('worker.markedAvailable'));
  };

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'userId' | 'date'>) => {
    const newTransaction: Transaction = { id: Date.now().toString(), userId: user?.id || '4', ...data, date: new Date() };
    setMyTransactions([newTransaction, ...myTransactions]);
    setShowTransactionForm(false);
    toast.success(t('farmer.transactionAdded'));
  };

  const handleAddVehicle = (data: Omit<Vehicle, 'id' | 'ownerId' | 'ownerName' | 'createdAt'>) => {
    const newVehicle: Vehicle = { id: Date.now().toString(), ownerId: user?.id || '4', ownerName: user?.name || 'Unknown', ...data, createdAt: new Date() };
    addVehicle(newVehicle);
    setMyVehicles([newVehicle, ...myVehicles]);
    setShowVehicleForm(false);
    toast.success(t('farmer.vehicleAdded'));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6 border-worker/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isAvailable ? <Bell className="h-5 w-5 text-worker" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
                <div>
                  <p className="font-medium text-foreground">{isAvailable ? t('worker.availableForWork') : t('worker.notAvailable')}</p>
                  <p className="text-sm text-muted-foreground">{isAvailable ? t('worker.farmersCanSee') : t('worker.noJobNotifications')}</p>
                </div>
              </div>
              <Switch checked={isAvailable} onCheckedChange={toggleAvailability} />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="jobs" className="flex items-center gap-1 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.findJobs')}</span>
              <span className="sm:hidden">{t('dashboard.jobs')}</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-1 text-xs sm:text-sm">
              <Tractor className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.myVehicles')}</span>
              <span className="sm:hidden">{t('dashboard.vehicles')}</span>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-1 text-xs sm:text-sm">
              <IndianRupee className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.earnings')}</span>
              <span className="sm:hidden">{t('dashboard.pl')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('worker.yourLocation')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input placeholder={t('driver.enterLocation')} value={myLocation} onChange={(e) => setMyLocation(e.target.value)} className="flex-1" />
                  <Button variant="outline" onClick={() => toast.success(t('driver.profileUpdated'))}>{t('common.update')}</Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">{t('worker.nearbyWorkOpportunities')}</h2>
                <Badge variant="outline">{t('worker.jobsCount', { count: nearbyJobs.length })}</Badge>
              </div>

              {nearbyJobs.length === 0 ? (
                <Card className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">{t('worker.noJobsAvailable')}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('worker.updateLocationOrCheckLater')}</p>
                </Card>
              ) : (
                nearbyJobs.map((job) => (
                  <Card key={job.id} className={appliedJobs.includes(job.id) ? 'border-success/50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{job.description}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />{job.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-worker">₹{job.pricePerDay}</p>
                          <p className="text-sm text-muted-foreground">{t('common.perDay')}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{format(job.startDate, 'MMM dd, yyyy')}</div>
                        <div className="flex items-center gap-1"><Users className="h-4 w-4" />{t('hire.workersNeeded', { count: job.requiredWorkers })}</div>
                        <span>{t('hire.days', { count: job.duration })}</span>
                      </div>
                      {appliedJobs.includes(job.id) ? (
                        <Button disabled className="w-full bg-success"><CheckCircle className="h-4 w-4 mr-2" />{t('worker.applied')}</Button>
                      ) : (
                        <Button onClick={() => handleApply(job)} className="w-full bg-worker hover:bg-worker/90">{t('worker.applyForJob')}</Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4 animate-fade-in">
            {showVehicleForm ? (
              <AddVehicleForm onSubmit={handleAddVehicle} onCancel={() => setShowVehicleForm(false)} userRole="worker" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{t('dashboard.myVehicles')}</h2>
                    <p className="text-muted-foreground text-sm">{t('worker.listVehiclesForRent')}</p>
                  </div>
                  <Button onClick={() => setShowVehicleForm(true)} className="bg-worker hover:bg-worker/90">
                    <Plus className="h-4 w-4 mr-2" />{t('driver.addVehicle')}
                  </Button>
                </div>
                {myVehicles.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Tractor className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">{t('worker.noVehiclesListed')}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t('worker.addVehiclesForIncome')}</p>
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
                              <p className="text-xl font-bold text-worker">₹{v.pricePerDay}</p>
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
            <ProfitLossCard transactions={myTransactions} userRole="worker" />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">{t('dashboard.earnings')}</h2>
              <Button onClick={() => setShowTransactionForm(true)} className="bg-worker hover:bg-worker/90">
                <Plus className="h-4 w-4 mr-2" />{t('dashboard.addEntry')}
              </Button>
            </div>
            {showTransactionForm ? (
              <AddTransactionForm onSubmit={handleAddTransaction} onCancel={() => setShowTransactionForm(false)} userRole="worker" />
            ) : (
              <TransactionList transactions={myTransactions} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
