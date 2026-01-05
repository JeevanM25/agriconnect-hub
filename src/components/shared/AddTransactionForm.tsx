import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction } from '@/types';
import { X } from 'lucide-react';

interface AddTransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'userId' | 'date'>) => void;
  onCancel: () => void;
  userRole: 'farmer' | 'middleman' | 'driver' | 'worker';
}

export function AddTransactionForm({ onSubmit, onCancel, userRole }: AddTransactionFormProps) {
  const [type, setType] = useState<Transaction['type']>('sale');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [partyName, setPartyName] = useState('');
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      description,
      amount: Number(amount),
      partyName: partyName || undefined,
      cropName: cropName || undefined,
      quantity: quantity ? Number(quantity) : undefined,
      unit: quantity ? unit : undefined,
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
        <CardTitle className="text-lg">Add Transaction</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as Transaction['type'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Sale / Income</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Input
              placeholder="e.g., Sold Rice to Suresh Trader"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Amount (₹) *</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label>Party Name (optional)</Label>
            <Input
              placeholder="e.g., Buyer/Seller name"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
            />
          </div>

          {(type === 'sale' || type === 'purchase') && (
            <>
              <div className="space-y-2">
                <Label>Crop Name (optional)</Label>
                <Input
                  placeholder="e.g., Rice, Wheat"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Quantity (optional)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="quintal">quintal</SelectItem>
                      <SelectItem value="ton">ton</SelectItem>
                      <SelectItem value="pieces">pieces</SelectItem>
                      <SelectItem value="bags">bags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className={`flex-1 bg-${roleColors[userRole]} hover:bg-${roleColors[userRole]}/90`}>
              Add Transaction
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
