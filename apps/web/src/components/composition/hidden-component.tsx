'use client';
import React from 'react';
interface HiddenComponentProps {
  children: React.ReactNode;
  isView: boolean;
  noDiv?: boolean;
}

const Hidden: React.FC<HiddenComponentProps> = ({
  children,
  isView,
  noDiv,
}) => {
  if (noDiv) {
    return <>{isView && children}</>;
  }

  return <>{isView ? children : <div />}</>;
};

export default Hidden;
