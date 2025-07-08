import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useGlucoseStore } from '@/stores/glucoseStore';
import type { Alert } from '@/types';

interface AlertTableProps {
  alerts: Alert[];
}

export const AlertTable: React.FC<AlertTableProps> = ({ alerts }) => {
  const { markAlertAsRead, deleteAlert } = useGlucoseStore();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-danger-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-danger-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning-500" />;
      default:
        return <Info className="w-4 h-4 text-primary-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="danger">Critical</Badge>;
      case 'error':
        return <Badge variant="danger">Error</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      default:
        return <Badge variant="info">Info</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMarkAsRead = async (alertId: number) => {
    await markAlertAsRead(alertId);
  };

  const handleDelete = async (alertId: number) => {
    await deleteAlert(alertId);
  };

  if (alerts.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-neutral-400">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <div className="text-sm">No active alerts</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {alerts.map((alert) => (
            <tr key={alert.id} className="hover:bg-neutral-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getSeverityIcon(alert.severity)}
                  <div className="ml-2">
                    {getSeverityBadge(alert.severity)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-neutral-900 capitalize">
                  {alert.alert_type.replace('_', ' ')}
                </div>
                <div className="text-sm text-neutral-500">
                  ID: {alert.glucose_reading_id}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-neutral-900">
                  {alert.message}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-neutral-900">
                  {formatTimestamp(alert.created_at)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  {alert.is_active && (
                    <Button
                      variant="success"
                      size="sm"
                      icon={Check}
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    icon={X}
                    onClick={() => handleDelete(alert.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 