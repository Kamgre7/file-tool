import { IZipHandler, ZipHandler } from '../zipHandler';

describe('Zip handler', () => {
  let firstFilename: string;
  let firstFileContent: Buffer;

  let secondFilename: string;
  let secondFileContent: Buffer;

  let zipHandler: IZipHandler;

  beforeAll(async () => {
    zipHandler = new ZipHandler();

    firstFilename = 'firstFile.txt';
    firstFileContent = Buffer.from('Content of first file');

    secondFilename = 'secondFile.txt';
    secondFileContent = Buffer.from('Content of second file');
  });

  it('Should return Buffer of created zip file and array of files information from zip file', async () => {
    const zipFileBuffer = await zipHandler.create([
      { filename: firstFilename, content: firstFileContent },
      { filename: secondFilename, content: secondFileContent },
    ]);

    expect(zipFileBuffer).toBeInstanceOf(Buffer);

    const filesInfo = await zipHandler.getFilesInformation(zipFileBuffer);

    expect(filesInfo).toStrictEqual([
      { originalName: firstFilename, content: firstFileContent.toString() },
      { originalName: secondFilename, content: secondFileContent.toString() },
    ]);
  });
});
