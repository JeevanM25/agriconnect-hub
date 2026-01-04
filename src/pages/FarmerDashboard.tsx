import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { LivePriceTicker } from '@/components/shared/LivePriceTicker';
import { SellCropForm } from '@/components/farmer/SellCropForm';
import { MyCropsList } from '@/components/farmer/MyCropsList';
import { HireWorkerForm } from '@/components/farmer/HireWorkerForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCrops, mockCropPrices, mockWorkerJobs } from '@/data/mockData';
import { Crop, WorkerJob } from '@/types';
import { ShoppingBag, Users, Plus, Package, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sell');
  const [showSellForm, setShowSellForm] = useState(false);
  const [showHireForm, setShowHireForm] = useState(false);
  const [myCrops, setMyCrops] = useState<Crop[]>(mockCrops.filter((c) => c.farmerId === '1'));
  const [myJobs, setMyJobs] = useState<WorkerJob[]>(mockWorkerJobs.filter((j) => j.farmerId === '1'));

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
    setMyCrops([newCrop, ...myCrops]);
    setShowSellForm(false);
  };

  const handleMarkAsSold = (cropId: string) => {
    setMyCrops(myCrops.map((c) => (c.id === cropId ? { ...c, status: 'sold' as const } : c)));
    toast.success('Crop marked as sold!');
  };

  const handleAddJob = (data: any) => {
    const newJob: WorkerJob = {
      id: Date.now().toString(),
      farmerId: user?.id || '1',
      ...data,
      status: 'open',
    };
    setMyJobs([newJob, ...myJobs]);
    setShowHireForm(false);
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
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Sell Crops
            </TabsTrigger>
            <TabsTrigger value="hire" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Hire Workers
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

          {/* Hire Workers Tab */}
          <TabsContent value="hire" className="space-y-4 animate-fade-in">
            {showHireForm ? (
              <HireWorkerForm onSubmit={handleAddJob} onCancel={() => setShowHireForm(false)} />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">My Job Postings</h2>
                  <Button onClick={() => setShowHireForm(true)} className="bg-farmer hover:bg-farmer/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Job
                  </Button>
                </div>

                {myJobs.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No job postings yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Post a job to hire workers for your farm
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {myJobs.map((job) => (
                      <Card key={job.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-foreground">{job.description}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{job.location}</p>
                            </div>
                            <span className="text-lg font-bold text-farmer">₹{job.pricePerDay}/day</span>
                          </div>
                          <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                            <span>{job.requiredWorkers} workers needed</span>
                            <span>{job.duration} days</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
