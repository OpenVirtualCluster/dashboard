import { Button } from "@/components/ui/button";

export function HostClusterDashboard({ clusters }) {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Kubernetes Host Clusters</h1>
      <div className="grid gap-6">
        {clusters.items.map((cluster, index) => (
          <div key={index} className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CloudIcon className="w-8 h-8 text-gray-900 dark:text-gray-50" />
                <h2 className="text-xl font-semibold">{cluster.metadata.name}</h2>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400">
                {cluster.spec.virtualClusters.length} Virtual Clusters
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 dark:text-gray-400">
                {cluster.spec.description}
              </p>
            </div>
            <div className="mt-4">
              <Button size="sm" variant="link">
                View Virtual Clusters
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CloudIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}
