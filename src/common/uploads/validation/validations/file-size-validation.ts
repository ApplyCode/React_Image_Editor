import {defineMessage} from 'react-intl';
import {UploadedFile} from '../../uploaded-file';
import {ErrorMessageDescriptor, UploadValidation} from './upload-validation';
import {prettyBytes} from '../../utils/pretty-bytes';

export class FileSizeValidation extends UploadValidation {
  constructor(protected params: {maxSize: number}) {
    super();

    this.errorMessage = defineMessage<ErrorMessageDescriptor>({
      defaultMessage: 'Maximum file size is {number}',
      values: {
        number: prettyBytes(+this.params.maxSize),
      },
    });
  }

  public fails(file: UploadedFile) {
    return this.params.maxSize < file.size;
  }
}
