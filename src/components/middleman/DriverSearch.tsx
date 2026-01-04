import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Phone, Star, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Driver {
  id: string;
  name: string;
  phone: string;
  location: string;
  vehicleType: string;
  rating: number;
  available: boolean;
}

const mockDrivers: Driver[] = [
  { id: '1', name: 'Krishna Driver', phone: '+91 9876543212', location: 'Shivamogga, Karnataka', vehicleType: 'Truck (10 ton)', rating: 4.8, available: true },
  { id: '2', name: 'Raju Transport', phone: '+91 9876543220', location: 'Shivamogga, Karnataka', vehicleType: 'Mini Truck (3 ton)', rating: 4.5, available: true },
  { id: '3', name: 'Venkat Lorry', phone: '+91 9876543221', location: 'Tumkur, Karnataka', vehicleType: 'Truck (8 ton)', rating: 4.7, available: false },
  { id: '4', name: 'Suresh Vehicles', phone: '+91 9876543222', location: 'Bangalore, Karnataka', vehicleType: 'Container (20 ton)', rating: 4.9, available: true },
];

export function DriverSearch() {
  const [location, setLocation] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const results = mockDrivers.filter((driver) =>
      !location || driver.location.toLowerCase().includes(location.toLowerCase())
    );
    setFilteredDrivers(results);
    setHasSearched(true);
  };

  const handleHire = (driver: Driver) => {
    toast.success(`Booking request sent to ${driver.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              placeholder="Search by location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-middleman hover:bg-middleman/90">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Found {filteredDrivers.length} driver{filteredDrivers.length !== 1 ? 's' : ''}
          </p>

          {filteredDrivers.length === 0 ? (
            <Card className="p-8 text-center">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No drivers found in this location</p>
            </Card>
          ) : (
            filteredDrivers.map((driver) => (
              <Card key={driver.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-driver/10 rounded-full">
                        <Truck className="h-6 w-6 text-driver" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{driver.name}</h3>
                          <Badge variant={driver.available ? 'default' : 'secondary'}>
                            {driver.available ? 'Available' : 'Busy'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{driver.vehicleType}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {driver.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-warning" />
                            {driver.rating}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`tel:${driver.phone}`)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      {driver.available && (
                        <Button
                          size="sm"
                          className="bg-driver hover:bg-driver/90"
                          onClick={() => handleHire(driver)}
                        >
                          Hire
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
