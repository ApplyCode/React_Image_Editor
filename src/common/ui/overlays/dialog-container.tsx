import {ReactElement, useEffect, useState} from 'react';

interface Props {
  children: ReactElement;
}
export function DialogContainer({children}: Props) {
  const [refAvailable, setRefAvailable] = useState(false);

  useEffect(() => {
    setRefAvailable(true);
  }, []);

  if (refAvailable) {
    return children;
  }
  return null;
}
