import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import BatchItem from './batch-admin/batch-item';

const itens = [{ name: 'Lote 01' }, { name: 'Lote 02' }, { name: 'Lote 03' }];

// style={{ border: '1px solid red' }}
const Batch: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="col-span-3 flex flex-col gap-4">
        {itens.map((item, index) => (
          <BatchItem key={item.name} data={item} />
        ))}
      </div>
      <div>
        <Card className="flex h-full flex-col bg-white shadow-lg">
          <CardContent className="p-4">Actions</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Batch;
