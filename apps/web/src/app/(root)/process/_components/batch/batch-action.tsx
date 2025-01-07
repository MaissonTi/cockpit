import React from 'react';

import { Button } from '@/components/ui/button';
import { useBatch } from '../../_context/batch-context';

const BatchAction: React.FC = () => {
  const { decline } = useBatch();

  return (
    <div>
      <Button
        onClick={() =>
          decline(['083e202a-f4e7-4721-8558-7178e3057ee1'], 'teste')
        }
      >
        Decline
      </Button>
    </div>
  );
};

export default BatchAction;
