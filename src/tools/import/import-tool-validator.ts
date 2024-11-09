import {UploadValidator} from '../../common/uploads/validation/upload-validator';
import {FileSizeValidation} from '../../common/uploads/validation/validations/file-size-validation';
import {AllowedExtensionsValidation} from '../../common/uploads/validation/validations/allowed-extensions-validation';
import {convertToBytes} from '../../common/uploads/utils/convert-to-bytes';
import {state} from '../../state/utils';

export class ImportToolValidator extends UploadValidator {
  protected readonly DEFAULT_MAX_FILE_SIZE_MB = 10;
  showToast = true;

  protected initValidations() {
    this.validations.push(
      new FileSizeValidation({maxSize: this.getMaxFileSize()})
    );

    const allowedExtensions = this.getAllowedExtensions();

    if (allowedExtensions && allowedExtensions.length) {
      this.validations.push(
        new AllowedExtensionsValidation({extensions: allowedExtensions})
      );
    }
  }

  protected getMaxFileSize(): number {
    return (
      state().config.tools?.import?.maxFileSize ??
      convertToBytes(this.DEFAULT_MAX_FILE_SIZE_MB, 'MB')
    );
  }

  protected getAllowedExtensions(): string[] {
    const imgExtensions =
      state().config.tools?.import?.validImgExtensions ?? [];
    return [...imgExtensions, 'json'];
  }
}
