import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [type, setType] = useState<Vehicle['type']>('tractor');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ type, name, description: description || undefined, pricePerDay: Number(pricePerDay), location, images: imageUrl ? [imageUrl] : [], available: true });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">{t('vehicles.addVehicleForRent')}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('vehicles.vehicleTypeRequired')}</Label>
            <Select value={type} onValueChange={(v) => setType(v as Vehicle['type'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tractor">{t('vehicles.tractor')}</SelectItem>
                <SelectItem value="harvester">{t('vehicles.harvester')}</SelectItem>
                <SelectItem value="rotavator">{t('vehicles.rotavator')}</SelectItem>
                <SelectItem value="truck">{t('vehicles.truck')}</SelectItem>
                <SelectItem value="mini_truck">{t('vehicles.miniTruck')}</SelectItem>
                <SelectItem value="trailer">{t('vehicles.trailer')}</SelectItem>
                <SelectItem value="other">{t('vehicles.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('vehicles.vehicleNameModel')}</Label>
            <Input placeholder={t('vehicles.vehicleNamePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>{t('vehicles.description')}</Label>
            <Textarea placeholder={t('vehicles.vehicleDescPlaceholder')} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>{t('vehicles.rentPricePerDay')}</Label>
            <Input type="number" placeholder={t('vehicles.rentPricePlaceholder')} value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} required min="1" />
          </div>
          <div className="space-y-2">
            <Label>{t('vehicles.locationRequired')}</Label>
            <Input placeholder={t('vehicles.locationPlaceholder')} value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>{t('vehicles.imageUrl')}</Label>
            <div className="flex gap-2">
              <Input placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <Button type="button" variant="outline" size="icon"><ImagePlus className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">{t('common.cancel')}</Button>
            <Button type="submit" className={`flex-1 bg-${userRole} hover:bg-${userRole}/90`}>{t('vehicles.addVehicle')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
