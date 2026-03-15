import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [type, setType] = useState<Transaction['type']>('sale');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [partyName, setPartyName] = useState('');
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ type, description, amount: Number(amount), partyName: partyName || undefined, cropName: cropName || undefined, quantity: quantity ? Number(quantity) : undefined, unit: quantity ? unit : undefined });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">{t('transactions.addTransaction')}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('transactions.transactionType')}</Label>
            <Select value={type} onValueChange={(v) => setType(v as Transaction['type'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">{t('transactions.saleIncome')}</SelectItem>
                <SelectItem value="purchase">{t('transactions.purchase')}</SelectItem>
                <SelectItem value="expense">{t('transactions.expense')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('transactions.descriptionRequired')}</Label>
            <Input placeholder={t('transactions.descriptionPlaceholder')} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>{t('transactions.amountRequired')}</Label>
            <Input type="number" placeholder={t('transactions.enterAmount')} value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" />
          </div>
          <div className="space-y-2">
            <Label>{t('transactions.partyName')}</Label>
            <Input placeholder={t('transactions.partyPlaceholder')} value={partyName} onChange={(e) => setPartyName(e.target.value)} />
          </div>
          {(type === 'sale' || type === 'purchase') && (
            <>
              <div className="space-y-2">
                <Label>{t('transactions.cropNameOptional')}</Label>
                <Input placeholder={t('transactions.cropPlaceholder')} value={cropName} onChange={(e) => setCropName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t('transactions.quantityOptional')}</Label>
                  <Input type="number" placeholder={t('transactions.quantityPlaceholder')} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('crops.unit')}</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="quintal">{t('crops.quintal')}</SelectItem>
                      <SelectItem value="ton">{t('crops.ton')}</SelectItem>
                      <SelectItem value="pieces">{t('crops.pieces')}</SelectItem>
                      <SelectItem value="bags">{t('crops.bags')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">{t('common.cancel')}</Button>
            <Button type="submit" className={`flex-1 bg-${userRole} hover:bg-${userRole}/90`}>{t('transactions.addTransaction')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
