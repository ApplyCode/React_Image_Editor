import {
  ErrorMessageDescriptor,
  UploadValidation,
} from './validations/upload-validation';
import {UploadedFile} from '../uploaded-file';
import {showToast} from '../../ui/toast/show-toast';

export abstract class UploadValidator {
  protected validations: UploadValidation[] = [];
  showToast = false;

  validate(file: UploadedFile): {
    failed: boolean;
    errorMessage?: ErrorMessageDescriptor | null;
  } {
    if (!this.validations.length) {
      this.initValidations();
    }

    const failed = this.validations.find(validation => {
      return validation.fails(file);
    });
    if (failed && this.showToast && failed.errorMessage) {
      showToast(failed.errorMessage, {type: 'error'});
    }

    return {
      failed: !!failed,
      errorMessage: failed ? failed.errorMessage : null,
    };
  }

  /**
   * Can't init validators in constructor, because ngxs
   * store injects do not wait for angular APP_INITIALIZER
   */
  protected abstract initValidations(): void;
}
