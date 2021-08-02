import React, { useCallback, useState, createContext, ReactNode} from 'react';
import { PDFDocument, PDFPage, scale } from "pdf-lib";
import { useContext } from 'react';
import { UploadedFile } from './UploadedFile';


interface ContextProps {
    files: UploadedFile[];
    addFiles: (files: File[], index?: any) => void;
    splitFile: (uploadedFile: UploadedFile) => void;
    reorderFiles: (a: any, b: any) => void;
    deleteFile: (uploadedFile: UploadedFile) => void;
}

async function uploadedFileFromImage(imageFile : File) {
  let imgPDF : PDFDocument = await PDFDocument.create();
  let image;
  if (imageFile.type == "image/png") {
    image = await imgPDF.embedPng(await imageFile.arrayBuffer());
  } else {
    image = await imgPDF.embedJpg(await imageFile.arrayBuffer());
  }
  let page = imgPDF.addPage([595, 842]);
  let scale = image.scale(1);

  scale = image.scale(Math.min(545/image.width, 792/image.height, 1));

  page.drawImage(image, {
    x: page.getWidth() / 2 - scale.width / 2,
    y: page.getHeight() / 2 - scale.height / 2,
    width: scale.width,
    height: scale.height,
  })
  let imagePDFFile : any = new Blob([await imgPDF.save()], {type: "application/pdf"});
  imagePDFFile.name = imageFile.name + " as pdf.pdf"
  imagePDFFile.lastModified = 0;
  return new UploadedFile(imagePDFFile as File, imgPDF);
}

let contains = (files: UploadedFile[], file: File) => (files.filter( (file2: UploadedFile) => (file2.file.name == file.name)).length > 0);

const FileContext = createContext<ContextProps | undefined>(undefined)

const FileContextWrapper = ({children }: {children: ReactNode}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  async function buildUploadedFile(file: File) {
    if (file == null) {
      return null;
    }

    if (contains(uploadedFiles, file)) {
      alert(file.name + " is the name of an existing file - it will not be uploaded.");
      return null
    }

    if (file.type == "image/png" || file.type == "image/jpeg") {
      let temp = await uploadedFileFromImage(file);
      if (contains(uploadedFiles, temp.file)) {return null}
      return temp;
    }

    else if (file.type == "application/pdf") {
      let pdf = await PDFDocument.load(await file.arrayBuffer());
      if (pdf.getPageCount() == 0) {
        alert("Invalid input: " + file.name);
        return null;
      } else {
        return new UploadedFile(file, pdf);
      }
    } else {
      return null;
    }
  }

  const addFiles = useCallback(
    async (newFiles : File[], index?) => {
      let updatedFiles = uploadedFiles;
      let newUploadedFiles: UploadedFile[] = [];
      let tempFile: UploadedFile | null;
      for (let i=0; i < newFiles.length; i++) {
        tempFile = await buildUploadedFile(newFiles[i]);
        if (tempFile != null) {
          newUploadedFiles.push(tempFile);
        }
      }

      if (index == undefined) {
        updatedFiles = updatedFiles.concat(newUploadedFiles);
      } else {
        updatedFiles.splice(index, 0, ...newUploadedFiles);
      }
      setUploadedFiles(updatedFiles);
    },
    [uploadedFiles]
  );

  const deleteFile = useCallback(
    async (uploadedFile: UploadedFile) => {
      let newFiles = Array.from(uploadedFiles);
      
      for (let i = 0; i < newFiles.length; i++) {
        if (uploadedFile === newFiles[i]) {
          newFiles.splice(i, 1); 
          break;
        }
      }

      setUploadedFiles(newFiles);
    },
    [uploadedFiles]
  );

  const splitFile = useCallback(
    async (uploadedFile: UploadedFile) => {
      let colorNumber = Math.floor(Math.random() * 16777215)
      let document : PDFDocument = uploadedFile.PDF;
      let file : File = uploadedFile.file;
      let splits : UploadedFile[] = [];
      let pageDoc : PDFDocument;
      let blob : any;
      if (document.getPageCount() == 1) {
        return
      }

      for (let i = 0; i < document.getPageCount(); i++) {
        pageDoc = await PDFDocument.create();
        let p : PDFPage[] = await pageDoc.copyPages(document, [i]);
        pageDoc.addPage(p[0]);

        blob = new Blob([await pageDoc.save()]);
        blob.lastModifiedDate = colorNumber;
        blob.name = "Page " + i.toString() + " of " + file.name;
        splits.push(new UploadedFile(blob, pageDoc));
      }
      let index =  uploadedFiles.findIndex((f) => (f.file == file));
      let updatedFiles = Array.from(uploadedFiles);
      updatedFiles.splice(index, 1, ...splits);

      setUploadedFiles(updatedFiles);
    },
    [uploadedFiles]
  );

  const reorderFiles = useCallback(
     (from: number, to: number) => {
      if(from >= 0 && from < uploadedFiles.length && to >= 0 && to < uploadedFiles.length){
        let newFiles = Array.from(uploadedFiles); // Copy the array, as arrays should not be changed directly
        let [deleted] = newFiles.splice(from, 1);
        newFiles.splice(to, 0, deleted);
        setUploadedFiles(newFiles);
      }
    },
    [uploadedFiles]
  );

  const fileStore = { files: uploadedFiles, addFiles, reorderFiles, splitFile, deleteFile}

  return (
    <FileContext.Provider value={fileStore} >
        {children}
    </FileContext.Provider>
  );
}

async function assemblePDF(files : UploadedFile[]) {
  if (files.length == 0) {
    console.log("SNJFDA")
  }
  let pdfs : PDFDocument[] = files.map((file) => (file.PDF));
  const merged = await PDFDocument.create();
  for (let i=0; i < pdfs.length; i++) {
    let pages = await merged.copyPages(pdfs[i], pdfs[i].getPageIndices());
    for (let j=0; j < pages.length; j++) {
      merged.addPage(pages[j]);
    }
  }

  let blob : any = new Blob([await merged.save({addDefaultPage: false})], {type:"application/pdf"});
  blob.name = "preview.pdf";
  blob.lastModified = 0;
  return new UploadedFile(blob, merged);
}

const useFileContext = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
 
export { FileContextWrapper, FileContext, assemblePDF , useFileContext};