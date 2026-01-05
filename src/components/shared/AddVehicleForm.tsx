import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vehicle } from '@/types';
import { X, ImagePlus } from 'lucide-react';

interface AddVehicleFormProps {
  onSubmit: (vehicle: Omit<Vehicle, 'id' | 'ownerId' | 'ownerName' | 'createdAt'>) => void;
  onCancel: () => void;
  userRole: 'farmer' | 'middleman' | 'driver' | 'worker';
}

export function AddVehicleForm({ onSubmit, onCancel, userRole }: AddVehicleFormProps) {
  const [type, setType] = useState<Vehicle['type']>('tractor');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      name,
      description: description || undefined,
      pricePerDay: Number(pricePerDay),
      location,
      images: imageUrl ? [imageUrl] : [],
      available: true,
    });
  };

  const roleColors = {
    farmer: 'farmer',
    middleman: 'middleman',
    driver: 'driver',
    worker: 'worker',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Add Your Vehicle for Rent</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Vehicle Type *</Label>
            <Select value={type} onValueChange={(v) => setType(v as Vehicle['type'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tractor">Tractor</SelectItem>
                <SelectItem value="harvester">Harvester</SelectItem>
                <SelectItem value="rotavator">Rotavator</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="mini_truck">Mini Truck</SelectItem>
                <SelectItem value="trailer">Trailer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Vehicle Name/Model *</Label>
            <Input
              placeholder="e.g., Mahindra 575 DI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe your vehicle, attachments, condition, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Rent Price per Day (₹) *</Label>
            <Input
              type="number"
              placeholder="e.g., 1500"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              required
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label>Location *</Label>
            <Input
              placeholder="e.g., Shivamogga, Karnataka"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Image URL (optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button type="button" variant="outline" size="icon">
                <ImagePlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className={`flex-1 bg-${roleColors[userRole]} hover:bg-${roleColors[userRole]}/90`}>
              Add Vehicle
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
