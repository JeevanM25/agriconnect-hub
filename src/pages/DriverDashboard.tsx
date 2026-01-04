import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockDriverJobs } from '@/data/mockData';
import { DriverJob } from '@/types';
import { MapPin, Calendar, Truck, Weight, Bell, BellOff, CheckCircle, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [myLocation, setMyLocation] = useState(user?.location || '');
  const [vehicleType, setVehicleType] = useState('Truck');
  const [acceptedJobs, setAcceptedJobs] = useState<string[]>([]);

  // Filter jobs by location
  const nearbyJobs = mockDriverJobs.filter(
    (job) =>
      job.status === 'open' &&
      job.pickupLocation.toLowerCase().includes(myLocation.toLowerCase().split(',')[0])
  );

  const handleAccept = (jobId: string) => {
    setAcceptedJobs([...acceptedJobs, jobId]);
    toast.success('Job accepted! Contact details will be shared.');
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    toast.success(isAvailable ? 'You are now marked as unavailable' : 'You are now available for trips');
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Availability Toggle */}
        <Card className="mb-6 border-driver/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isAvailable ? (
                  <Bell className="h-5 w-5 text-driver" />
                ) : (
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {isAvailable ? 'Available for Trips' : 'Not Available'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isAvailable ? 'You can receive trip requests' : 'You won\'t receive trip notifications'}
                  </p>
                </div>
              </div>
              <Switch checked={isAvailable} onCheckedChange={toggleAvailability} />
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Location</label>
                <Input
                  placeholder="Enter your location"
                  value={myLocation}
                  onChange={(e) => setMyLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Type</label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mini Truck">Mini Truck (1-3 ton)</SelectItem>
                    <SelectItem value="Truck">Truck (5-10 ton)</SelectItem>
                    <SelectItem value="Lorry">Lorry (10-20 ton)</SelectItem>
                    <SelectItem value="Container">Container (20+ ton)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="outline" onClick={() => toast.success('Profile updated!')}>
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Available Trips */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Available Trips</h2>
            <Badge variant="outline">{nearbyJobs.length} trips</Badge>
          </div>

          {nearbyJobs.length === 0 ? (
            <Card className="p-8 text-center">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No trips available from your location</p>
              <p className="text-sm text-muted-foreground mt-1">
                Update your location or check back later
              </p>
            </Card>
          ) : (
            nearbyJobs.map((job) => (
              <Card key={job.id} className={acceptedJobs.includes(job.id) ? 'border-success/50' : ''}>
                <CardContent className="p-4">
                  {/* Route */}
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
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(job.date, 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      {job.vehicleType}
                    </div>
                    <div className="flex items-center gap-1">
                      <Weight className="h-4 w-4" />
                      {job.weight} kg
                    </div>
                  </div>

                  {acceptedJobs.includes(job.id) ? (
                    <Button disabled className="w-full bg-success">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accepted
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleAccept(job.id)}
                      className="w-full bg-driver hover:bg-driver/90"
                    >
                      Accept Trip
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
