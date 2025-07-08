import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, TrendingDown, Minus, Clock, Activity } from 'lucide-react';
import type { GlucoseReading } from '@/types';

interface CurrentReadingProps {
  reading: GlucoseReading | null;
}

export const CurrentReading: React.FC<CurrentReadingProps> = ({ reading }) => {
  if (!reading) {
    return (
      <div className="flex items-center justify-center h-32 text-neutral-400">
        <div className="text-center">
          <Activity className="w-8 h-8 mx-auto mb-2" />
          <div className="text-sm">No current reading</div>
        </div>
      </div>
    );
  }

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

  const getStatusBadge = (value: number) => {
    const status = getGlucoseStatus(value);
    switch (status) {
      case 'critical':
        return <Badge variant="danger">Critical</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      default:
        return <Badge variant="success">Normal</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-warning-500" />;
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-success-500" />;
      case 'rising_rapidly':
        return <TrendingUp className="w-4 h-4 text-danger-500" />;
      case 'falling_rapidly':
        return <TrendingDown className="w-4 h-4 text-danger-500" />;
      default:
        return <Minus className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'Rising';
      case 'falling':
        return 'Falling';
      case 'rising_rapidly':
        return 'Rising Rapidly';
      case 'falling_rapidly':
        return 'Falling Rapidly';
      case 'stable':
        return 'Stable';
      default:
        return 'Unknown';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      time: date.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      date: date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  };

  const { time, date } = formatTimestamp(reading.timestamp);

  return (
    <div className="space-y-4">
      {/* Main Value */}
      <div className="text-center">
        <div className={`text-6xl font-bold ${getGlucoseStatusColor(reading.value)}`}>
          {reading.value}
        </div>
        <div className="text-lg text-neutral-600 mt-1">mg/dL</div>
        <div className="mt-2">{getStatusBadge(reading.value)}</div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Trend */}
        <div className="bg-neutral-50 rounded-medical p-3">
          <div className="flex items-center space-x-2">
            {getTrendIcon(reading.trend)}
            <span className="text-sm font-medium text-neutral-900">Trend</span>
          </div>
          <div className="text-lg font-semibold text-neutral-900 mt-1">
            {getTrendText(reading.trend)}
          </div>
        </div>

        {/* Mode */}
        <div className="bg-neutral-50 rounded-medical p-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-900">Mode</span>
          </div>
          <div className="text-lg font-semibold text-neutral-900 mt-1 capitalize">
            {reading.mode}
          </div>
        </div>

        {/* Time */}
        <div className="bg-neutral-50 rounded-medical p-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-900">Time</span>
          </div>
          <div className="text-lg font-semibold text-neutral-900 mt-1">
            {time}
          </div>
        </div>

        {/* Date */}
        <div className="bg-neutral-50 rounded-medical p-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-900">Date</span>
          </div>
          <div className="text-sm font-semibold text-neutral-900 mt-1">
            {date}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-primary-50 rounded-medical p-3">
        <div className="text-sm text-primary-800">
          <strong>Reading ID:</strong> #{reading.id}
        </div>
        <div className="text-sm text-primary-800 mt-1">
          <strong>Created:</strong> {new Date(reading.created_at).toLocaleString('it-IT')}
        </div>
      </div>
    </div>
  );
}; 