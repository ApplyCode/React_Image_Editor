import {getFileMime} from './utils/get-file-mime';
import {extensionFromFilename} from './utils/extension-from-filename';

export class UploadedFile {
  name: string;
  relativePath?: string | null;
  size: number;
  mime: string | null;
  extension?: string;
  native: File;
  lastModified: number;
  url: string | null = null;

  private cachedData?: string;
  get data(): Promise<string> {
    return new Promise(resolve => {
      if (this.cachedData) {
        resolve(this.cachedData);
      }
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        this.cachedData = reader.result as string;
        resolve(this.cachedData);
      });

      if (this.extension === 'json') {
        reader.readAsText(this.native);
      } else {
        reader.readAsDataURL(this.native);
      }
    });
  }

  constructor(file: File, relativePath?: string | null) {
    this.name = file.name;
    this.size = file.size;
    this.mime = getFileMime(file);
    this.lastModified = file.lastModified;
    this.extension = extensionFromFilename(file.name);
    this.native = file;
    relativePath = relativePath || file.webkitRelativePath || null;
    // only include relative path if file is actually in a folder and not just /file.txt
    if (relativePath && relativePath.match(/\//g)!.length > 1) {
      this.relativePath = relativePath;
    }
  }
}
