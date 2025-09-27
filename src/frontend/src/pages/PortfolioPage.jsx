import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";

const PortfolioPage = () => {
  // Placeholder data for portfolio
  const portfolioValue = "$125,450.75";
  const dailyChange = "+1.2% ($1,500)";
  const holdings = [
    { id: 1, name: "Tech Innovations Fund", symbol: "TIF", shares: 150, value: 75000, change: "+" },
    { id: 2, name: "Green Energy ETF", symbol: "GEE", shares: 300, value: 30000, change: "-" },
    { id: 3, name: "Global Markets Index", symbol: "GMI", shares: 200, value: 20000, change: "+" },
  ];
  const transactions = [
    { id: 1, type: "Buy", symbol: "TIF", shares: 50, price: 500, date: "2023-01-15" },
    { id: 2, type: "Sell", symbol: "GEE", shares: 100, price: 100, date: "2023-02-20" },
    { id: 3, type: "Buy", symbol: "GMI", shares: 20, price: 1000, date: "2023-03-10" },
  ];

  return (
    <div className="min-h-screen w-screen flex flex-col items-center p-8 bg-background text-foreground">
      <h1 className="text-5xl font-extrabold mb-8">Your Portfolio</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Portfolio Value Card */}
        <Card className="col-span-full md:col-span-1 bg-card border shadow-lg">
          <CardHeader>
            <CardTitle>Current Value</CardTitle>
            <CardDescription>Your portfolio's estimated worth.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary mb-2">{portfolioValue}</p>
            <p className="text-lg text-muted-foreground">{dailyChange} today</p>
          </CardContent>
        </Card>

        {/* Performance Chart Card (Placeholder) */}
        <Card className="col-span-full md:col-span-2 bg-card border shadow-lg">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Your portfolio's historical performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              [Chart Placeholder]
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings and Transactions Tabs */}
      <Tabs defaultValue="holdings" className="w-full max-w-6xl mt-8 bg-card border shadow-lg rounded-lg">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="holdings" className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Current Holdings</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {holdings.map((holding) => (
              <Card key={holding.id} className="flex items-center justify-between p-4 border">
                <div>
                  <p className="text-lg font-semibold">{holding.name} ({holding.symbol})</p>
                  <p className="text-sm text-muted-foreground">{holding.shares} shares</p>
                </div>
                <p className={`text-lg font-bold ${holding.change === '+' ? 'text-green-500' : 'text-red-500'}`}>${holding.value.toLocaleString()}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="transactions" className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="flex items-center justify-between p-4 border">
                <div>
                  <p className="text-lg font-semibold">{transaction.type} {transaction.symbol}</p>
                  <p className="text-sm text-muted-foreground">{transaction.shares} shares @ ${transaction.price}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <p className={`text-lg font-bold ${transaction.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>${(transaction.shares * transaction.price).toLocaleString()}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioPage;
