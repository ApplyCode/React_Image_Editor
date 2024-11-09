import {defineMessage} from 'react-intl';
import {UploadedFile} from '../../uploaded-file';
import {ErrorMessageDescriptor, UploadValidation} from './upload-validation';

export class BlockedExtensionsValidation extends UploadValidation {
  constructor(protected params: {extensions: string[]}) {
    super();

    this.errorMessage = defineMessage<ErrorMessageDescriptor>({
      defaultMessage: 'These file types are not allowed: {extensions}',
      values: {
        extensions: this.params.extensions.join(', '),
      },
    });
  }

  public fails(file: UploadedFile) {
    return this.params.extensions.some(extension => {
      return extension === file.extension;
    });
  }
}
