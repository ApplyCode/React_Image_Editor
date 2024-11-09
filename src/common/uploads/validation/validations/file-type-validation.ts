import {defineMessage} from 'react-intl';
import {UploadedFile} from '../../uploaded-file';
import {ErrorMessageDescriptor, UploadValidation} from './upload-validation';

type MIMES = 'image' | 'video' | 'audio';

export class FileTypeValidation extends UploadValidation {
  constructor(protected params: {types: MIMES[]}) {
    super();

    this.errorMessage =
      this.params.types.length > 1
        ? this.getPluralMessage()
        : this.getSingularMessage();
  }

  public fails(file: UploadedFile) {
    return !this.params.types.some(type => {
      return type === (file.mime && file.mime.split('/')[0]);
    });
  }

  private getSingularMessage() {
    return defineMessage<ErrorMessageDescriptor>({
      defaultMessage: 'File must be a {type}',
      values: {
        type: this.params.types[0],
      },
    });
  }

  private getPluralMessage() {
    return defineMessage<ErrorMessageDescriptor>({
      defaultMessage: 'File must be one of these types: {types}',
      values: {
        types: this.params.types.join(', '),
      },
    });
  }
}
