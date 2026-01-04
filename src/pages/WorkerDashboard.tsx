import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { mockWorkerJobs } from '@/data/mockData';
import { WorkerJob } from '@/types';
import { MapPin, IndianRupee, Calendar, Users, Bell, BellOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [myLocation, setMyLocation] = useState(user?.location || '');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  // Filter jobs by location
  const nearbyJobs = mockWorkerJobs.filter(
    (job) =>
      job.status === 'open' &&
      job.location.toLowerCase().includes(myLocation.toLowerCase().split(',')[0])
  );

  const handleApply = (jobId: string) => {
    setAppliedJobs([...appliedJobs, jobId]);
    toast.success('Application sent successfully!');
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    toast.success(isAvailable ? 'You are now marked as unavailable' : 'You are now available for work');
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

        {/* Location Setting */}
        <Card className="mb-6">
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
                      onClick={() => handleApply(job.id)}
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
      </main>
    </div>
  );
}
