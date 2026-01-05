import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HireWorkerForm } from '@/components/farmer/HireWorkerForm';
import { DriverSearch } from '@/components/middleman/DriverSearch';
import { WorkerJob } from '@/types';
import { Users, Truck, Plus } from 'lucide-react';

interface HireSectionProps {
  userRole: 'farmer' | 'middleman';
  myJobs: WorkerJob[];
  onAddJob: (data: any) => void;
}

export function HireSection({ userRole, myJobs, onAddJob }: HireSectionProps) {
  const [showHireForm, setShowHireForm] = useState(false);
  const [activeHireTab, setActiveHireTab] = useState('workers');

  const roleColor = userRole === 'farmer' ? 'farmer' : 'middleman';

  const handleAddJob = (data: any) => {
    onAddJob(data);
    setShowHireForm(false);
  };

  return (
    <Tabs value={activeHireTab} onValueChange={setActiveHireTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="workers" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Wage Workers
        </TabsTrigger>
        <TabsTrigger value="drivers" className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Drivers
        </TabsTrigger>
      </TabsList>

      <TabsContent value="workers" className="space-y-4">
        {showHireForm ? (
          <HireWorkerForm onSubmit={handleAddJob} onCancel={() => setShowHireForm(false)} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">My Job Postings</h3>
              <Button onClick={() => setShowHireForm(true)} className={`bg-${roleColor} hover:bg-${roleColor}/90`}>
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </div>

            {myJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No job postings yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Post a job to hire workers
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
                        <span className={`text-lg font-bold text-${roleColor}`}>₹{job.pricePerDay}/day</span>
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

      <TabsContent value="drivers" className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Find Transport</h3>
          <p className="text-muted-foreground">Search for drivers near you</p>
        </div>
        <DriverSearch />
      </TabsContent>
    </Tabs>
  );
}
