import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Crop } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MapPin, Package, Calendar, User, Search } from 'lucide-react';
import { toast } from 'sonner';

interface CropSearchProps {
  crops: Crop[];
}

export function CropSearch({ crops }: CropSearchProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useState('');
  const [cropType, setCropType] = useState('');
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');

  const handleSearch = () => {
    const results = crops.filter((crop) => {
      const locationMatch = !location || crop.location.toLowerCase().includes(location.toLowerCase());
      const cropMatch = !cropType || crop.name.toLowerCase().includes(cropType.toLowerCase());
      return locationMatch && cropMatch && crop.status === 'available';
    });
    setFilteredCrops(results);
    setHasSearched(true);
  };

  const handleRequestMeeting = (crop: Crop) => {
    if (!meetingDate || !meetingTime) { toast.error(t('crops.selectDateTime')); return; }
    toast.success(t('crops.meetingRequestSent', { name: crop.farmerName }));
    setMeetingDate(''); setMeetingTime('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1"><Input placeholder={t('crops.searchByLocation')} value={location} onChange={(e) => setLocation(e.target.value)} className="w-full" /></div>
            <div className="flex-1"><Input placeholder={t('crops.searchByCropType')} value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full" /></div>
            <Button onClick={handleSearch} className="bg-middleman hover:bg-middleman/90"><Search className="h-4 w-4 mr-2" />{t('common.search')}</Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="space-y-4">
          <p className="text-muted-foreground">{t('crops.found', { count: filteredCrops.length })}</p>
          {filteredCrops.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">{t('crops.noCropsFound')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('crops.adjustFilters')}</p>
            </Card>
          ) : (
            filteredCrops.map((crop) => (
              <Card key={crop.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-40 sm:h-auto bg-muted">
                      {crop.images[0] ? <img src={crop.images[0]} alt={crop.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="h-8 w-8 text-muted-foreground" /></div>}
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-xl text-foreground">{crop.name}</h3>
                          <Badge variant="outline" className="mt-1">{t('crops.grade', { grade: crop.quality })}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-middleman">₹{crop.pricePerUnit}</p>
                          <p className="text-sm text-muted-foreground">per {crop.unit}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{crop.farmerName}</span></div>
                        <div className="flex items-center gap-2"><Package className="h-4 w-4" /><span>{crop.quantity} {crop.unit}</span></div>
                        <div className="flex items-center gap-2 col-span-2"><MapPin className="h-4 w-4" /><span>{crop.location}</span></div>
                      </div>
                      {crop.description && <p className="text-sm text-muted-foreground mb-4">{crop.description}</p>}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full sm:w-auto bg-middleman hover:bg-middleman/90"><Calendar className="h-4 w-4 mr-2" />{t('crops.requestMeeting')}</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>{t('crops.scheduleMeeting', { name: crop.farmerName })}</DialogTitle></DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="font-medium">{crop.name}</p>
                              <p className="text-sm text-muted-foreground">{crop.quantity} {crop.unit} @ ₹{crop.pricePerUnit}/{crop.unit}</p>
                            </div>
                            <div className="space-y-2"><Label>{t('crops.preferredDate')}</Label><Input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} /></div>
                            <div className="space-y-2"><Label>{t('crops.preferredTime')}</Label><Input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} /></div>
                            <Button onClick={() => handleRequestMeeting(crop)} className="w-full bg-middleman hover:bg-middleman/90">{t('crops.sendRequest')}</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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
