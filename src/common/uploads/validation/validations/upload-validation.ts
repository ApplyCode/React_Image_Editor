import {MessageDescriptor} from 'react-intl';
import {UploadedFile} from '../../uploaded-file';

export interface ErrorMessageDescriptor extends MessageDescriptor {
  values?: Record<string, string | null>;
}

export abstract class UploadValidation {
  errorMessage?: ErrorMessageDescriptor;
  abstract fails(file: UploadedFile): boolean;

  passes(file: UploadedFile) {
    return !this.fails(file);
  }
}
