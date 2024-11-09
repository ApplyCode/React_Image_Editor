import {defineMessage} from 'react-intl';
import {UploadedFile} from '../../uploaded-file';
import {ErrorMessageDescriptor, UploadValidation} from './upload-validation';

export class AllowedExtensionsValidation extends UploadValidation {
  constructor(protected params: {extensions: string[]}) {
    super();

    this.errorMessage = defineMessage<ErrorMessageDescriptor>({
      defaultMessage: 'Only these file types are allowed: {extensions}',
      values: {
        extensions: this.params.extensions.join(', '),
      },
    });
  }

  public fails(file: UploadedFile) {
    return !this.params.extensions.some(extension => {
      return extension.toLowerCase() === file.extension?.toLowerCase();
    });
  }
}
