import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, CpuIcon, MemoryStickIcon, CalendarClockIcon, TriangleAlertIcon, CloudIcon } from './icons';
import { DNA, Rings } from 'react-loader-spinner';

export function NavBar() {
  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
      <Link className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4" href="#">
        <img src="/favicon.png" alt="Favicon" className="w-13 h-12" />
        <span className="sr-only">Kubernetes Dashboard</span>
      </Link>
      <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
        <Link className="text-lg font-semibold hover:text-orange-100" href="#">
          OpenVirtualCluster Fleet Manager
        </Link>
      </nav>
    </header>
  );
}

const ExpandableUClusterRow = ({ name, namespace, status, cpuUsage, memoryUsage, podHealth, events, alerts }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online':
        return 'green';
      case 'Sleeping':
        return 'yellow';
      default:
        return 'red';
    }
  };

  const statusColor = getStatusColor(status);

  // Determine if the cluster is unhealthy
  const isUnhealthy = cpuUsage !== 'loading' && memoryUsage !== 'loading' && (cpuUsage >= 60 || memoryUsage >= 60);

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      <div className="flex items-center justify-between bg-gray-100 px-6 py-4 dark:bg-gray-950">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CloudIcon className="w-6 h-6" />
            <h3 className="font-medium">{name}</h3>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span>Namespace: {namespace}</span>
          </div>
          {/* <Badge
            className={`bg-${statusColor}-400 text-${statusColor}-900 dark:bg-${statusColor}-600 dark:text-${statusColor}-50`}
            variant="outline"
          >
            {status}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <CpuIcon className="w-4 h-4" />
            {cpuUsage === 'loading' ? (
              <DNA height="20" width="20" ariaLabel="loading" />
            ) : (
              <span>{cpuUsage}%</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <MemoryStickIcon className="w-4 h-4" />
            {memoryUsage === 'loading' ? (
              <DNA height="20" width="20" ariaLabel="loading" />
            ) : (
              <span>{memoryUsage}%</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            {podHealth === 'loading' ? (
              <Rings height="20" width="20" color="yellow" ariaLabel="loading" />
            ) : (
              <Badge className="bg-green-500 text-white" variant="outline">
                Workload Health : {podHealth}%
              </Badge>
            )}
          </div>
          <Badge className={`bg-${isUnhealthy ? 'red' : 'green'}-500 text-white`} variant="outline">
            {isUnhealthy ? 'Unhealthy' : 'Healthy'}
          </Badge> */}
          <Button size="icon" variant="ghost" onClick={toggleExpand}>
            {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="border-t dark:border-gray-800 p-6 grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            {events && events.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium mb-2">Events</h4>
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 grid gap-4 text-sm">
                    {events.map((event, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400">{event.time}</span>
                        </div>
                        <Badge className="bg-green-500 text-white" variant="outline">
                          {event.status}
                        </Badge>
                        <div>
                          <h5 className="font-medium">{event.title}</h5>
                          <p className="text-gray-500 dark:text-gray-400">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-medium mb-2">Events</h4>
                <p className="text-gray-500 dark:text-gray-400">No events available.</p>
              </div>
            )}
            {alerts && alerts.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium mb-2">Alerts</h4>
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 grid gap-4 text-sm">
                    {alerts.map((alert, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TriangleAlertIcon className="w-4 h-4 text-red-500" />
                          <span className="text-gray-500 dark:text-gray-400">{alert.time}</span>
                        </div>
                        <Badge className="bg-red-500 text-white" variant="outline">
                          {alert.status}
                        </Badge>
                        <div>
                          <h5 className="font-medium">{alert.title}</h5>
                          <p className="text-gray-500 dark:text-gray-400">{alert.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-medium mb-2">Alerts</h4>
                <p className="text-gray-500 dark:text-gray-400">No alerts available.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const VClusterDashboard = ({ clusterItems }) => {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
      <div className="max-w-6xl w-full mx-auto">
        {clusterItems.map((item, index) => (
          <ExpandableUClusterRow
            key={item.id}
            name={item.name}
            namespace={item.namespace}
            status={item.status}
            cpuUsage={item.cpuUsage || 'loading'}
            memoryUsage={item.memoryUsage || 'loading'}
            podHealth={item.podHealth || 'loading'}
            events={item.events}
            alerts={item.alerts}
          />
        ))}
        <div className="flex justify-end mt-4">
          <Pagination />
        </div>
      </div>
    </main>
  );
};
