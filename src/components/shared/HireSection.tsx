import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
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
  const { t } = useTranslation();
  const [showHireForm, setShowHireForm] = useState(false);
  const [activeHireTab, setActiveHireTab] = useState('workers');
  const roleColor = userRole === 'farmer' ? 'farmer' : 'middleman';

  const handleAddJob = (data: any) => { onAddJob(data); setShowHireForm(false); };

  return (
    <Tabs value={activeHireTab} onValueChange={setActiveHireTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="workers" className="flex items-center gap-2"><Users className="h-4 w-4" />{t('hire.wageWorkers')}</TabsTrigger>
        <TabsTrigger value="drivers" className="flex items-center gap-2"><Truck className="h-4 w-4" />{t('hire.drivers')}</TabsTrigger>
      </TabsList>

      <TabsContent value="workers" className="space-y-4">
        {showHireForm ? (
          <HireWorkerForm onSubmit={handleAddJob} onCancel={() => setShowHireForm(false)} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">{t('hire.myJobPostings')}</h3>
              <Button onClick={() => setShowHireForm(true)} className={`bg-${roleColor} hover:bg-${roleColor}/90`}>
                <Plus className="h-4 w-4 mr-2" />{t('hire.postJob')}
              </Button>
            </div>
            {myJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">{t('hire.noJobPostings')}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('hire.postJobToHire')}</p>
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
                        <span className={`text-lg font-bold text-${roleColor}`}>₹{job.pricePerDay}/{t('common.perDay')}</span>
                      </div>
                      <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                        <span>{t('hire.workersNeeded', { count: job.requiredWorkers })}</span>
                        <span>{t('hire.days', { count: job.duration })}</span>
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
          <h3 className="text-lg font-semibold text-foreground">{t('hire.findTransport')}</h3>
          <p className="text-muted-foreground">{t('hire.searchDriversNearYou')}</p>
        </div>
        <DriverSearch />
      </TabsContent>
    </Tabs>
  );
}
