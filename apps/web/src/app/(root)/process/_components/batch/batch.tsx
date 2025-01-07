import React, { useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { useBatch } from '../../_context/batch-context';
import BatchAction from './batch-action';
import BatchItem from './batch-admin/batch-item';

const Batch: React.FC = () => {
  const { batchs, birds, decline } = useBatch();

  useEffect(() => {
    console.log('birdsssss', birds);
  }, [birds]);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="col-span-3 flex flex-col gap-4">
        {batchs.map((item, index) => (
          <BatchItem key={item.name} data={item} />
        ))}
      </div>
      <div>
        <Card className="flex h-full flex-col bg-white shadow-lg mb-2">
          <CardContent className="p-4">
            <BatchAction />
          </CardContent>
        </Card>
        <Card className="flex h-full flex-col bg-white shadow-lg">
          {birds.map(item => (
            <CardContent key={item.batch} className="p-4">
              <div className="font-bold">{item.batch}</div>
              {item.birds.map((i, key) => (
                <div className={i.isDecline ? 'line-through' : ''} key={key}>
                  {i?.user?.username} - {i?.amount}
                </div>
              ))}
            </CardContent>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Batch;
