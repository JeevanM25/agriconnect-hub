import { useTranslation } from 'react-i18next';
import { Crop } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Package, IndianRupee, MessageSquare, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MyCropsListProps {
  crops: Crop[];
  onMarkAsSold: (cropId: string) => void;
}

export function MyCropsList({ crops, onMarkAsSold }: MyCropsListProps) {
  const { t } = useTranslation();

  const statusColors = {
    available: 'bg-success text-success-foreground',
    in_discussion: 'bg-warning text-warning-foreground',
    sold: 'bg-muted text-muted-foreground',
  };

  const statusLabels = {
    available: t('common.available'),
    in_discussion: t('dashboard.inDiscussion'),
    sold: t('dashboard.sold'),
  };

  return (
    <div className="space-y-4">
      {crops.length === 0 ? (
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t('crops.noCropsListed')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('crops.addFirstCrop')}</p>
        </Card>
      ) : (
        crops.map((crop) => (
          <Card key={crop.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-40 h-32 sm:h-auto bg-muted">
                  {crop.images[0] ? (
                    <img src={crop.images[0]} alt={crop.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{crop.name}</h3>
                      <Badge className={cn('mt-1', statusColors[crop.status])}>{statusLabels[crop.status]}</Badge>
                    </div>
                    <Badge variant="outline" className="text-sm">{t('crops.grade', { grade: crop.quality })}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-3">
                    <div className="flex items-center gap-1"><Package className="h-4 w-4" /><span>{crop.quantity} {crop.unit}</span></div>
                    <div className="flex items-center gap-1"><IndianRupee className="h-4 w-4" /><span>₹{crop.pricePerUnit}/{crop.unit}</span></div>
                    <div className="flex items-center gap-1 col-span-2"><MapPin className="h-4 w-4" /><span>{crop.location}</span></div>
                  </div>
                  {crop.status !== 'sold' && (
                    <div className="flex gap-2 mt-4">
                      {crop.status === 'in_discussion' && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-1" />{t('crops.viewMessages')}
                        </Button>
                      )}
                      <Button size="sm" onClick={() => onMarkAsSold(crop.id)} className="flex-1 bg-success hover:bg-success/90">
                        <CheckCircle2 className="h-4 w-4 mr-1" />{t('crops.markAsSold')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
