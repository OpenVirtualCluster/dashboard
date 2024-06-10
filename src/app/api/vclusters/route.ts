import { NextApiRequest, NextApiResponse } from 'next';
import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node';
import { NextResponse } from 'next/server';

const kubeConfig = new KubeConfig();
kubeConfig.loadFromDefault();

const k8sCustomObjectsApi = kubeConfig.makeApiClient(CustomObjectsApi);

const vClusterGroup = 'vclusters.openvirtualcluster.dev';
const vClusterVersion = 'v1alpha1';
const vClusterPlural = 'vclusters';

export async function GET() {
  try {
    // Fetch VClusters from all namespaces
    const response = await k8sCustomObjectsApi.listClusterCustomObject(
      vClusterGroup,
      vClusterVersion,
      vClusterPlural
    );

    var clusterList : any = await response.body;
    // console.log('VClusters:', clusterList);
    return NextResponse.json(clusterList);
  } catch (error) {
    console.error('Error fetching VClusters:', error);
    return NextResponse.error();
  }
}
