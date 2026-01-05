import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types';
import { TrendingUp, TrendingDown, IndianRupee, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ProfitLossCardProps {
  transactions: Transaction[];
  userRole: 'farmer' | 'middleman' | 'driver' | 'worker';
}

export function ProfitLossCard({ transactions, userRole }: ProfitLossCardProps) {
  const totalSales = transactions
    .filter((t) => t.type === 'sale' || t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'purchase' || t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const profitLoss = totalSales - totalExpenses;
  const isProfit = profitLoss >= 0;

  const roleColors = {
    farmer: 'farmer',
    middleman: 'middleman',
    driver: 'driver',
    worker: 'worker',
  };

  const roleColor = roleColors[userRole];

  return (
    <Card className={`border-${roleColor}/30`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <IndianRupee className={`h-5 w-5 text-${roleColor}`} />
          Profit & Loss Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-success/10">
            <div className="flex items-center justify-center gap-1 text-success mb-1">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-xs font-medium">Income</span>
            </div>
            <p className="text-xl font-bold text-success">₹{totalSales.toLocaleString()}</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-destructive/10">
            <div className="flex items-center justify-center gap-1 text-destructive mb-1">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-xs font-medium">Expense</span>
            </div>
            <p className="text-xl font-bold text-destructive">₹{totalExpenses.toLocaleString()}</p>
          </div>

          <div className={`text-center p-3 rounded-lg ${isProfit ? 'bg-success/10' : 'bg-destructive/10'}`}>
            <div className={`flex items-center justify-center gap-1 ${isProfit ? 'text-success' : 'text-destructive'} mb-1`}>
              {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="text-xs font-medium">{isProfit ? 'Profit' : 'Loss'}</span>
            </div>
            <p className={`text-xl font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
              ₹{Math.abs(profitLoss).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
