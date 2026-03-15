import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, Receipt } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { t } = useTranslation();
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) { case 'sale': case 'income': return 'bg-success/10 text-success'; case 'purchase': case 'expense': return 'bg-destructive/10 text-destructive'; default: return 'bg-muted text-muted-foreground'; }
  };

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) { case 'sale': return t('dashboard.sale'); case 'purchase': return t('dashboard.purchase'); case 'income': return t('dashboard.income'); case 'expense': return t('dashboard.expense'); default: return type; }
  };

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">{t('transactions.noTransactions')}</p>
        <p className="text-sm text-muted-foreground mt-1">{t('transactions.transactionsAppearHere')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${transaction.type === 'sale' || transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  {transaction.type === 'sale' || transaction.type === 'income' ? <ArrowUpRight className="h-4 w-4 text-success" /> : <ArrowDownRight className="h-4 w-4 text-destructive" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{transaction.description}</p>
                  {transaction.partyName && (
                    <p className="text-sm text-muted-foreground">{transaction.type === 'sale' ? t('transactions.to') : t('transactions.from')}: {transaction.partyName}</p>
                  )}
                  {transaction.cropName && transaction.quantity && (
                    <p className="text-xs text-muted-foreground mt-1">{transaction.quantity} {transaction.unit} {t('transactions.of')} {transaction.cropName}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(transaction.date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${transaction.type === 'sale' || transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                  {transaction.type === 'sale' || transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </p>
                <Badge variant="outline" className={getTypeColor(transaction.type)}>{getTypeLabel(transaction.type)}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
