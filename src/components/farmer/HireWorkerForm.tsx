import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface HireWorkerFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function HireWorkerForm({ onSubmit, onCancel }: HireWorkerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    pricePerDay: '',
    description: '',
    requiredWorkers: '',
    startDate: '',
    duration: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        requiredWorkers: Number(formData.requiredWorkers),
        duration: Number(formData.duration),
        startDate: new Date(formData.startDate),
      });
      toast.success('Job posted successfully!');
    } catch (error) {
      toast.error('Failed to post job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-farmer/30">
      <CardHeader>
        <CardTitle className="text-farmer">Post Work for Wage Workers</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Work Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Village/Town, District"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Daily Wage (₹)</Label>
              <Input
                id="pricePerDay"
                name="pricePerDay"
                type="number"
                placeholder="500"
                value={formData.pricePerDay}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requiredWorkers">Workers Needed</Label>
              <Input
                id="requiredWorkers"
                name="requiredWorkers"
                type="number"
                placeholder="5"
                value={formData.requiredWorkers}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="3"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Work Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the work - harvesting, planting, etc."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-farmer hover:bg-farmer/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Job'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
