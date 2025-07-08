import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { GlucoseReading } from '@/types';

interface GlucoseChartProps {
  readings: GlucoseReading[];
}

export const GlucoseChart: React.FC<GlucoseChartProps> = ({ readings }) => {
  // Transform data for chart
  const chartData = readings.map(reading => ({
    time: new Date(reading.timestamp).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    value: reading.value,
    trend: reading.trend,
    timestamp: reading.timestamp,
  })).reverse(); // Reverse to show oldest to newest

  // Get threshold values from environment
  const highThreshold = parseInt(import.meta.env.VITE_ALERT_THRESHOLD_HIGH || '180');
  const lowThreshold = parseInt(import.meta.env.VITE_ALERT_THRESHOLD_LOW || '70');
  const criticalHigh = parseInt(import.meta.env.VITE_ALERT_THRESHOLD_CRITICAL_HIGH || '250');
  const criticalLow = parseInt(import.meta.env.VITE_ALERT_THRESHOLD_CRITICAL_LOW || '50');

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const status = getGlucoseStatus(data.value);
      
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-medical shadow-medical">
          <p className="font-medium text-neutral-900">{`Time: ${label}`}</p>
          <p className={`text-lg font-bold ${getGlucoseStatusColor(data.value)}`}>
            {`Glucose: ${data.value} mg/dL`}
          </p>
          <p className="text-sm text-neutral-600 capitalize">
            {`Trend: ${data.trend}`}
          </p>
          <p className={`text-sm ${getStatusTextColor(status)}`}>
            {getStatusText(status)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getGlucoseStatus = (value: number) => {
    if (value >= criticalHigh || value <= criticalLow) return 'critical';
    if (value >= highThreshold || value <= lowThreshold) return 'warning';
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical':
        return 'Critical Level';
      case 'warning':
        return 'Warning Level';
      default:
        return 'Normal Level';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-glucose-critical';
      case 'warning':
        return 'text-glucose-high';
      default:
        return 'text-glucose-normal';
    }
  };

  if (readings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400">
        <div className="text-center">
          <div className="text-lg font-medium">No data available</div>
          <div className="text-sm">Glucose readings will appear here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          {/* Reference lines for thresholds */}
          <ReferenceLine
            y={criticalHigh}
            stroke="#dc2626"
            strokeDasharray="3 3"
            strokeWidth={2}
            label={{ value: `Critical High: ${criticalHigh}`, position: 'top' }}
          />
          <ReferenceLine
            y={highThreshold}
            stroke="#ca8a04"
            strokeDasharray="3 3"
            strokeWidth={1}
            label={{ value: `High: ${highThreshold}`, position: 'top' }}
          />
          <ReferenceLine
            y={lowThreshold}
            stroke="#ca8a04"
            strokeDasharray="3 3"
            strokeWidth={1}
            label={{ value: `Low: ${lowThreshold}`, position: 'bottom' }}
          />
          <ReferenceLine
            y={criticalLow}
            stroke="#dc2626"
            strokeDasharray="3 3"
            strokeWidth={2}
            label={{ value: `Critical Low: ${criticalLow}`, position: 'bottom' }}
          />
          
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 20', 'dataMax + 20']}
            tickFormatter={(value) => `${value} mg/dL`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 