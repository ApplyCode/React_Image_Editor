import {toast} from 'react-hot-toast';
import {MessageDescriptor} from 'react-intl';

interface Options {
  type?: 'error' | null;
}
export function showToast(
  message: MessageDescriptor | string,
  {type}: Options = {}
) {
  if (type === 'error') {
    return toast.error(message as any);
  }
  return toast(message as any);
}
