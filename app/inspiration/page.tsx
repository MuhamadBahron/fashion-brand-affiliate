'use client';

import { Suspense } from 'react';
import InspirationContent from './InspirationContent';

export default function InspirationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <InspirationContent />
    </Suspense>
  );
}
