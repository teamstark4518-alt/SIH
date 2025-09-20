import React from 'react';
import { TrendingUp, Users, Activity, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Patients',
      value: '2,847',
      change: '+12.5% from last month',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Encounters Today', 
      value: '156',
      change: '+8.2% from yesterday',
      icon: Activity,
      trend: 'up'
    },
    {
      title: 'Exact Mapping %',
      value: '94.2%',
      change: '+2.1% improvement',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: 'API Response Time',
      value: '127ms',
      change: '-5.3% faster',
      icon: Clock,
      trend: 'down'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Dr. Sarah Johnson</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your patients today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                <p className={`text-xs mt-2 ${
                  stat.trend === 'up' ? 'text-success' : 'text-warning'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                stat.trend === 'up' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">API Response Time</h3>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization coming soon</p>
            </div>
          </div>
        </Card>

        <Card className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-border">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New patient registered</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 pb-3 border-b border-border">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">FHIR bundle generated</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Lab report uploaded</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}