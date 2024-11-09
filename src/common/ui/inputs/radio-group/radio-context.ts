import {RadioGroupState} from '@react-stately/radio';
import React, {useContext} from 'react';
import {InputSize} from '../input-field/input-size';

interface RadioGroupContext {
  isEmphasized?: boolean;
  name?: string;
  state: RadioGroupState;
  size?: InputSize;
}

export const RadioContext = React.createContext<RadioGroupContext | null>(null);

export function useRadioProvider(): RadioGroupContext {
  return useContext(RadioContext)!;
}
