import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
import { mockWorkerJobs } from '@/data/mockData';
import { WorkerJob, Transaction, Vehicle } from '@/types';
import { MapPin, Calendar, Users, Bell, BellOff, CheckCircle, IndianRupee, Tractor, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
  const [isAvailable, setIsAvailable] = useState(true);
  const [myLocation, setMyLocation] = useState(user?.location || '');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);

  // Filter jobs by location
  const nearbyJobs = mockWorkerJobs.filter(
    (job) =>
      job.status === 'open' &&
      job.location.toLowerCase().includes(myLocation.toLowerCase().split(',')[0])
  );

  const handleApply = (job: WorkerJob) => {
    setAppliedJobs([...appliedJobs, job.id]);
    // Add as potential income
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user?.id || '4',
      type: 'income',
      description: `Applied: ${job.description}`,
      amount: job.pricePerDay * job.duration,
      partyName: 'Pending confirmation',
      date: new Date(),
    };
    setMyTransactions([newTransaction, ...myTransactions]);
    toast.success('Application sent successfully!');
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    toast.success(isAvailable ? 'You are now marked as unavailable' : 'You are now available for work');
  };

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'userId' | 'date'>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user?.id || '4',
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
      ownerId: user?.id || '4',
      ownerName: user?.name || 'Unknown',
      ...data,
      createdAt: new Date(),
    };
    setMyVehicles([newVehicle, ...myVehicles]);
    setShowVehicleForm(false);
    toast.success('Vehicle added for rent!');
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Availability Toggle */}
        <Card className="mb-6 border-worker/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isAvailable ? (
                  <Bell className="h-5 w-5 text-worker" />
                ) : (
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {isAvailable ? 'Available for Work' : 'Not Available'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isAvailable ? 'Farmers can see your profile' : 'You won\'t receive job notifications'}
                  </p>
                </div>
              </div>
              <Switch checked={isAvailable} onCheckedChange={toggleAvailability} />
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="jobs" className="flex items-center gap-1 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Find Jobs</span>
              <span className="sm:hidden">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-1 text-xs sm:text-sm">
              <Tractor className="h-4 w-4" />
              <span className="hidden sm:inline">My Vehicles</span>
              <span className="sm:hidden">Vehicles</span>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-1 text-xs sm:text-sm">
              <IndianRupee className="h-4 w-4" />
              <span className="hidden sm:inline">Earnings</span>
              <span className="sm:hidden">P&L</span>
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4 animate-fade-in">
            {/* Location Setting */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter your location"
                    value={myLocation}
                    onChange={(e) => setMyLocation(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => toast.success('Location updated!')}
                  >
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Jobs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Nearby Work Opportunities</h2>
                <Badge variant="outline">{nearbyJobs.length} jobs</Badge>
              </div>

              {nearbyJobs.length === 0 ? (
                <Card className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No jobs available in your area</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Update your location or check back later
                  </p>
                </Card>
              ) : (
                nearbyJobs.map((job) => (
                  <Card key={job.id} className={appliedJobs.includes(job.id) ? 'border-success/50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{job.description}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-worker">₹{job.pricePerDay}</p>
                          <p className="text-sm text-muted-foreground">per day</p>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(job.startDate, 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.requiredWorkers} workers needed
                        </div>
                        <span>{job.duration} day{job.duration > 1 ? 's' : ''}</span>
                      </div>

                      {appliedJobs.includes(job.id) ? (
                        <Button disabled className="w-full bg-success">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Applied
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleApply(job)}
                          className="w-full bg-worker hover:bg-worker/90"
                        >
                          Apply for This Job
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-4 animate-fade-in">
            {showVehicleForm ? (
              <AddVehicleForm
                onSubmit={handleAddVehicle}
                onCancel={() => setShowVehicleForm(false)}
                userRole="worker"
              />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">My Vehicles</h2>
                    <p className="text-muted-foreground text-sm">List your vehicles for rent</p>
                  </div>
                  <Button onClick={() => setShowVehicleForm(true)} className="bg-worker hover:bg-worker/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>

                {myVehicles.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Tractor className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No vehicles listed yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add your vehicles to earn extra income
                    </p>
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
                              <p className="text-xs text-muted-foreground">per day</p>
                              <Badge variant={v.available ? 'default' : 'secondary'} className="mt-1">
                                {v.available ? 'Available' : 'Rented'}
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

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-4 animate-fade-in">
            <ProfitLossCard transactions={myTransactions} userRole="worker" />

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Earnings</h2>
              <Button onClick={() => setShowTransactionForm(true)} className="bg-worker hover:bg-worker/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>

            {showTransactionForm ? (
              <AddTransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => setShowTransactionForm(false)}
                userRole="worker"
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
