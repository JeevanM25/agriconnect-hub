import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SellCropFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function SellCropForm({ onSubmit, onCancel }: SellCropFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', quantity: '', unit: 'kg', pricePerUnit: '', location: '', description: '', quality: 'A' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => setImages((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ ...formData, images, quantity: Number(formData.quantity), pricePerUnit: Number(formData.pricePerUnit) });
      toast.success(t('crops.cropListedSuccess'));
    } catch (error) {
      toast.error(t('crops.cropListedFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-farmer/30">
      <CardHeader>
        <CardTitle className="text-farmer">{t('crops.listCropForSale')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('crops.cropName')}</Label>
            <Input id="name" name="name" placeholder={t('crops.cropNamePlaceholder')} value={formData.name} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{t('crops.quantity')}</Label>
              <Input id="quantity" name="quantity" type="number" placeholder={t('crops.enterQuantity')} value={formData.quantity} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">{t('crops.unit')}</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">{t('crops.kilogram')}</SelectItem>
                  <SelectItem value="quintal">{t('crops.quintal')}</SelectItem>
                  <SelectItem value="ton">{t('crops.ton')}</SelectItem>
                  <SelectItem value="pieces">{t('crops.pieces')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerUnit">{t('crops.pricePerUnit', { unit: formData.unit })}</Label>
            <Input id="pricePerUnit" name="pricePerUnit" type="number" placeholder={t('crops.enterPrice')} value={formData.pricePerUnit} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>{t('crops.qualityGrade')}</Label>
            <Select value={formData.quality} onValueChange={(value) => setFormData({ ...formData, quality: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A">{t('crops.gradeA')}</SelectItem>
                <SelectItem value="B">{t('crops.gradeB')}</SelectItem>
                <SelectItem value="C">{t('crops.gradeC')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">{t('common.location')}</Label>
            <Input id="location" name="location" placeholder={t('crops.locationPlaceholder')} value={formData.location} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('common.description')}</Label>
            <Textarea id="description" name="description" placeholder={t('crops.descriptionPlaceholder')} value={formData.description} onChange={handleChange} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>{t('crops.cropImages')}</Label>
            <div className="flex flex-wrap gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                  <img src={img} alt={`Crop ${index + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 bg-destructive rounded-full">
                    <X className="h-3 w-3 text-destructive-foreground" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">{t('crops.addPhoto')}</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">{t('common.cancel')}</Button>
            <Button type="submit" className="flex-1 bg-farmer hover:bg-farmer/90" disabled={isLoading}>
              {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('crops.listing')}</>) : t('crops.listCrop')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
