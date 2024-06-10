import type { NextApiRequest, NextApiResponse } from 'next';
import { KubeConfig } from '@kubernetes/client-node';
import { NextResponse } from 'next/server';

type KubeConfigResponse = {
  kubeconfigs: string[];
};

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<KubeConfigResponse>
) {
  try {
    const kubeConfig = new KubeConfig();
    kubeConfig.loadFromDefault();

    // Retrieve all contexts from the kubeconfig
    const contexts = kubeConfig.getContexts();
    const kubeconfigStrings = contexts.map(context => {
      const contextKubeConfig = new KubeConfig();
      contextKubeConfig.loadFromOptions({
        clusters: kubeConfig.getClusters(),
        users: kubeConfig.getUsers(),
        contexts: [context],
        currentContext: context.name,
      });
      return contextKubeConfig.exportConfig();
    });

    return NextResponse.json({ kubeconfigs: kubeconfigStrings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching kubeconfigs:', error);
    return NextResponse.json({ error: `Unexpected error: ${error}` }, { status: 500 });
  }
}
