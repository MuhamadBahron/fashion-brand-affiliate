'use client';

import { Suspense } from 'react';
import InspirationContent from './InspirationContent';

export default function InspirationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      }
    >
      <InspirationContent />
    </Suspense>
  );
}
