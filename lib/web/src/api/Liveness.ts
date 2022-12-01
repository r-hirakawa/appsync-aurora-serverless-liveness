import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { graphqlOperation, GraphQLResult } from '@aws-amplify/api-graphql';
import { liveness } from './graphql/queries';
import { LivenessQuery } from './graphql/models';

export const Status = {
  UP: 'UP',
  DOWN: 'DOWN',
  ERROR: 'ERROR',
};

export function useLiveness(): [string, () => Promise<void>] {
  const [status, setStatus] = useState<string>(Status.DOWN);
  const [retry, setRetry] = useState(Date.now());

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (status === Status.DOWN) {
      timeout = setTimeout(() => {
        livenessProbe();
      }, 3000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [retry]);

  const livenessProbe = async () => {
    console.log('livenessProbe');
    try {
      const result = (await API.graphql(graphqlOperation(liveness))) as GraphQLResult<LivenessQuery>;
      if (result.errors) {
        setStatus(Status.ERROR);
        return;
      }
      const currentStatus = result.data?.liveness?.status;
      if (currentStatus) {
        setStatus(currentStatus);
        if (currentStatus === Status.DOWN) {
          setRetry(Date.now());
        }
      }
    } catch (e: unknown) {
      setStatus(Status.ERROR);
    }
  };

  return [status, livenessProbe];
}
