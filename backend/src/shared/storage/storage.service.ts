export interface IStorageAdapter {
  uploadFile(fileBuffer: Buffer, fileName: string, folder?: string): Promise<{ url: string; publicId: string }>;
  deleteFile(publicId: string): Promise<boolean>;
}

export class CloudinaryAdapter implements IStorageAdapter {
  async uploadFile(_fileBuffer: Buffer, fileName: string, folder = 'best_school'): Promise<{ url: string; publicId: string }> {
    const mockPublicId = `${folder}/${Date.now()}_${fileName}`;
    const mockUrl = `https://res.cloudinary.com/best-school/image/upload/v1/${mockPublicId}`;
    return { url: mockUrl, publicId: mockPublicId };
  }

  async deleteFile(_publicId: string): Promise<boolean> {
    return true;
  }
}

export class StorageService {
  private adapter: IStorageAdapter;

  constructor(adapter?: IStorageAdapter) {
    this.adapter = adapter || new CloudinaryAdapter();
  }

  public setAdapter(adapter: IStorageAdapter): void {
    this.adapter = adapter;
  }

  public async upload(fileBuffer: Buffer, fileName: string, folder?: string) {
    return this.adapter.uploadFile(fileBuffer, fileName, folder);
  }

  public async delete(publicId: string) {
    return this.adapter.deleteFile(publicId);
  }
}
