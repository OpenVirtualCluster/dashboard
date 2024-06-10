'use client';

import { VClusterDashboard, NavBar } from '@/components/dashboard';
import Loading from '@/components/loading';
import { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [vClusters, setVClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVClusters = async () => {
      try {
        const response = await fetch('/api/vclusters');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            result += decoder.decode(value, { stream: true });
          }
        }

        const clusters = JSON.parse(result);
        const clusterItems = clusters.items.map((cluster: any) => {
          let status = "Unknown";
          const conditions = cluster.status.conditions || [];

          const apiReadyCondition = conditions.find((condition: any) => condition.type === 'APIReady' && condition.status === 'True');
          const sleepCondition = conditions.find((condition: any) => condition.type === 'Sleep' && condition.status === 'True');

          if (apiReadyCondition) {
            status = "Online";
          } else {
            status = "Offline";
          }
          
          if (sleepCondition) {
            status = "Sleeping";
          } 

          return {
            id: cluster.metadata.uid,
            name: cluster.metadata.name,
            namespace: cluster.metadata.namespace,
            status: status,
            usage: "loading", // Initial usage set to loading
            lastUpdated: cluster.metadata.creationTimestamp,
            cpuUsage: "loading", // Initial cpuUsage set to loading
            memoryUsage: "loading", // Initial memoryUsage set to loading
            podHealth: "loading", // Initial podHealth set to loading
          };
        });

        setVClusters(clusterItems);
        setLoading(false);

        // Fetch cluster overview data asynchronously
        clusterItems.forEach(async (cluster: any) => {
          const clusterOverview = await fetchClusterOverview(
            cluster.name,
            cluster.namespace
          );

          setVClusters((prevClusters: any) =>
            prevClusters.map((item: any) =>
              item.id === cluster.id
                ? {
                    ...item,
                    usage: clusterOverview?.percentageHealthyPods || "loading",
                    cpuUsage: ((clusterOverview?.cpuUsage / clusterOverview?.totalCPU) * 100).toFixed(2) || "loading",
                    memoryUsage: calculateMemoryUsagePercentage(clusterOverview?.memoryUsage, clusterOverview?.totalMemory) || "loading",
                    podHealth: clusterOverview?.percentageHealthyPods || "loading",
                  }
                : item
            )
          );
        });
      } catch (error) {
        console.error('Error fetching VClusters:', error);
        setLoading(false);
      }
    };

    fetchVClusters();
  }, []);

  const fetchClusterOverview = async (vclusterName: string, namespace: string) => {
    try {
      const response = await fetch(
        `/api/vclusteroverview?name=${vclusterName}&namespace=${namespace}`
      );
      if (!response.ok) {
        console.error('Error fetching cluster overview:', response);
      }
      const clusterOverview = await response.json();
      return {
        percentageHealthyPods: clusterOverview.percentageHealthyPods,
        cpuUsage: clusterOverview.cpuUsage,
        memoryUsage: clusterOverview.memoryUsage,
        totalCPU: clusterOverview.totalCPU,
        totalMemory: clusterOverview.totalMemory,
      };
    } catch (error) {
      console.error('Error fetching cluster overview:', error);
      return null;
    }
  };

  const calculateMemoryUsagePercentage = (memoryUsage: string, totalMemory: string) => {
    if (!memoryUsage || !totalMemory) {
      return null;
    }
    const memoryUsageMiB = convertToMiB(memoryUsage);
    const totalMemoryMiB = convertToMiB(totalMemory);
    return ((memoryUsageMiB / totalMemoryMiB) * 100).toFixed(2);
  };

  const convertToMiB = (memory: string) => {
    const value = parseFloat(memory);
    if (memory.endsWith('Gi')) {
      return value * 1024; // Convert GiB to MiB
    } else if (memory.endsWith('Mi')) {
      return value; // Already in MiB
    } else {
      throw new Error(`Unknown memory unit: ${memory}`);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <NavBar />
      {loading ? 
        <Loading /> :
        <VClusterDashboard clusterItems={vClusters} />
      }
    </div>
  );
};

export default Home;
