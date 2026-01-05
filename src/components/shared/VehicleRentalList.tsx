import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Vehicle } from '@/types';
import { MapPin, IndianRupee, Tractor, Truck, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface VehicleRentalListProps {
  vehicles: Vehicle[];
  userLocation?: string;
}

export function VehicleRentalList({ vehicles, userLocation = '' }: VehicleRentalListProps) {
  const [searchLocation, setSearchLocation] = useState(userLocation);
  const [searchType, setSearchType] = useState('');

  const filteredVehicles = vehicles.filter((v) => {
    const matchesLocation = v.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesType = !searchType || v.type === searchType;
    return matchesLocation && matchesType && v.available;
  });

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'tractor':
      case 'harvester':
      case 'rotavator':
        return <Tractor className="h-5 w-5" />;
      default:
        return <Truck className="h-5 w-5" />;
    }
  };

  const handleRent = (vehicleId: string) => {
    toast.success('Rental request sent! Owner will contact you.');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          placeholder="Search by location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {['tractor', 'harvester', 'truck', 'mini_truck', 'rotavator', 'trailer'].map((type) => (
          <Badge
            key={type}
            variant={searchType === type ? 'default' : 'outline'}
            className="cursor-pointer capitalize"
            onClick={() => setSearchType(searchType === type ? '' : type)}
          >
            {type.replace('_', ' ')}
          </Badge>
        ))}
      </div>

      {filteredVehicles.length === 0 ? (
        <Card className="p-8 text-center">
          <Tractor className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No vehicles available</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different location or type</p>
        </Card>
      ) : (
        filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {vehicle.images[0] && (
                  <img
                    src={vehicle.images[0]}
                    alt={vehicle.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        {getVehicleIcon(vehicle.type)}
                        <h3 className="font-semibold text-foreground">{vehicle.name}</h3>
                      </div>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {vehicle.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-farmer">₹{vehicle.pricePerDay}</p>
                      <p className="text-xs text-muted-foreground">per day</p>
                    </div>
                  </div>

                  {vehicle.description && (
                    <p className="text-sm text-muted-foreground mb-2">{vehicle.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {vehicle.location}
                    </div>
                    <Button size="sm" onClick={() => handleRent(vehicle.id)}>
                      <Phone className="h-4 w-4 mr-1" />
                      Request Rental
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">Owner: {vehicle.ownerName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
