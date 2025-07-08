import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GlucoseChart } from '@/components/charts/GlucoseChart';
import { AlertTable } from '@/components/alerts/AlertTable';
import { CurrentReading } from '@/components/charts/CurrentReading';
import { useGlucoseStore, useGlucoseSelectors } from '@/stores/glucoseStore';
import { RefreshCw, Activity, AlertTriangle, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    readings,
    alerts,
    isLoading,
    forceReading,
    fetchReadings,
    fetchAlerts,
  } = useGlucoseStore();

  const {
    latestReading,
    averageGlucose,
    glucoseRange,
    activeAlertsCount,
    criticalAlerts,
  } = useGlucoseSelectors();

  const handleForceReading = async () => {
    await forceReading();
  };

  const handleRefresh = async () => {
    await Promise.all([fetchReadings(), fetchAlerts()]);
  };

  const getGlucoseStatus = (value: number) => {
    const high = parseInt(import.meta.env.VITE_ALERT_THRESHOLD_HIGH || '180');
    const low = parseInt(import.meta.env.VITE_ALERT_THRESHOLD_LOW || '70');
    const criticalHigh = parseInt(import.meta.env.VITE_ALERT_THRESHOLD_CRITICAL_HIGH || '250');
    const criticalLow = parseInt(import.meta.env.VITE_ALERT_THRESHOLD_CRITICAL_LOW || '50');

    if (value >= criticalHigh || value <= criticalLow) return 'critical';
    if (value >= high || value <= low) return 'warning';
    return 'normal';
  };

  const getGlucoseStatusColor = (value: number) => {
    const status = getGlucoseStatus(value);
    switch (status) {
      case 'critical':
        return 'text-glucose-critical';
      case 'warning':
        return 'text-glucose-high';
      default:
        return 'text-glucose-normal';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Glucose Monitor Dashboard
          </h1>
          <p className="text-neutral-600 mt-1">
            Real-time monitoring of glucose levels
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={handleRefresh}
            loading={isLoading === 'loading'}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={Activity}
            onClick={handleForceReading}
            loading={isLoading === 'loading'}
          >
            Force Reading
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="medical-grid-cols-4">
        <Card title="Current Glucose" subtitle="Latest reading">
          <div className="text-center">
            {latestReading ? (
              <>
                <div className={`text-5xl font-bold ${getGlucoseStatusColor(latestReading.value)}`}>
                  {latestReading.value}
                </div>
                <div className="text-sm text-neutral-600 mt-1">mg/dL</div>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm capitalize">{latestReading.trend}</span>
                </div>
              </>
            ) : (
              <div className="text-neutral-400">No data</div>
            )}
          </div>
        </Card>

        <Card title="Average Glucose" subtitle="Last 12 readings">
          <div className="text-center">
            <div className="text-3xl font-bold text-neutral-900">
              {averageGlucose > 0 ? averageGlucose.toFixed(1) : '--'}
            </div>
            <div className="text-sm text-neutral-600 mt-1">mg/dL</div>
          </div>
        </Card>

        <Card title="Glucose Range" subtitle="Min - Max">
          <div className="text-center">
            <div className="text-3xl font-bold text-neutral-900">
              {glucoseRange.min > 0 ? `${glucoseRange.min} - ${glucoseRange.max}` : '--'}
            </div>
            <div className="text-sm text-neutral-600 mt-1">mg/dL</div>
          </div>
        </Card>

        <Card title="Active Alerts" subtitle="Requiring attention">
          <div className="text-center">
            <div className="text-3xl font-bold text-neutral-900">
              {activeAlertsCount}
            </div>
            <div className="text-sm text-neutral-600 mt-1">alerts</div>
            {criticalAlerts.length > 0 && (
              <Badge variant="danger" className="mt-2">
                {criticalAlerts.length} Critical
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="medical-grid-cols-2">
        {/* Glucose Chart */}
        <Card title="Glucose Trend" subtitle="Last 12 readings">
          <GlucoseChart readings={readings} />
        </Card>

        {/* Current Reading Details */}
        <Card title="Current Reading Details">
          <CurrentReading reading={latestReading} />
        </Card>
      </div>

      {/* Alerts Section */}
      <Card 
        title="Active Alerts" 
        subtitle={`${activeAlertsCount} alerts requiring attention`}
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-warning-500" />
              <h3 className="medical-card-title">Active Alerts</h3>
            </div>
            {activeAlertsCount > 0 && (
              <Badge variant="danger">{activeAlertsCount}</Badge>
            )}
          </div>
        }
      >
        <AlertTable alerts={alerts} />
      </Card>
    </div>
  );
}; 