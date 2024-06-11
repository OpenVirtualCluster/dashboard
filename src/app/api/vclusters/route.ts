import { NextApiRequest, NextApiResponse } from 'next';
import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node';
import { NextResponse } from 'next/server';
import * as fs from 'fs';

export async function GET() {
  try {
    // Check if running inside a Kubernetes pod
    const inCluster = fs.existsSync('/var/run/secrets/kubernetes.io/serviceaccount/token');

    const kubeConfig = new KubeConfig();
    if (inCluster) {
      // Load the service account credentials from the mounted volumes
      kubeConfig.loadFromCluster();
    } else {
      // Load the default kubeconfig from the user's home directory
      kubeConfig.loadFromDefault();
    }

    const k8sCustomObjectsApi = kubeConfig.makeApiClient(CustomObjectsApi);

    const vClusterGroup = 'vclusters.openvirtualcluster.dev';
    const vClusterVersion = 'v1alpha1';
    const vClusterPlural = 'vclusters';

    // Fetch VClusters from all namespaces
    const response = await k8sCustomObjectsApi.listClusterCustomObject(
      vClusterGroup,
      vClusterVersion,
      vClusterPlural
    );

    var clusterList: any = await response.body;
    return NextResponse.json(clusterList);
  } catch (error) {
    console.error('Error fetching VClusters:', error);
    return NextResponse.error();
  }
}
