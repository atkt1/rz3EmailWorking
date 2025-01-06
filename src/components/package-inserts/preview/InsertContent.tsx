import { useState, useEffect } from 'react';
import { Basic3_5x8_5Layout } from './layouts/Basic3_5x8_5Layout';
import { Standard3_5x8_5Layout } from './layouts/Standard3_5x8_5Layout';
import { Basic4x6Layout } from './layouts/Basic4x6Layout';
import { Standard4x6Layout } from './layouts/Standard4x6Layout';
import type { PackageInsert } from '@/lib/types/packageInsert';

interface InsertContentProps {
  design: PackageInsert;
  surveyUrl?: string;
}

export function InsertContent({ design, surveyUrl }: InsertContentProps) {
  const [forceUpdate, setForceUpdate] = useState(false);

  // Special handler for edit mode initial logo load
  useEffect(() => {
    if (design.include_logo && design.logo_path) {
      const img = new Image();
      img.onload = () => {
        setForceUpdate(prev => !prev);
      };
      img.src = design.logo_path;
    }
  }, [design.logo_path, design.include_logo]);

  switch (design.style_size) {
    case 'Basic (3.5" X 8.5")':
      return <Basic3_5x8_5Layout design={design} surveyUrl={surveyUrl} key={forceUpdate ? 1 : 0} />;
    case 'Standard (3.5" X 8.5")':
      return <Standard3_5x8_5Layout design={design} surveyUrl={surveyUrl} key={forceUpdate ? 1 : 0} />;
    case 'Basic (4" X 6")':
      return <Basic4x6Layout design={design} surveyUrl={surveyUrl} key={forceUpdate ? 1 : 0} />;
    case 'Standard (4" X 6")':
      return <Standard4x6Layout design={design} surveyUrl={surveyUrl} key={forceUpdate ? 1 : 0} />;
    default:
      return null;
  }
}