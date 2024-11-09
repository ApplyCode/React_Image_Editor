import React, {ReactNode} from 'react';
import {InputSize} from './input-size';

export interface CommonInputFieldProps {
  label?: ReactNode;
  inline?: boolean;
  className?: string;
  size?: InputSize;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}
