import React, { useCallback, useState, createContext, ReactNode} from 'react';
import { PDFDocument, PDFPage, scale } from "pdf-lib";


interface ContextProps {
    files: File[];
    addFiles: (files: File[], index?: any) => void;
    splitFile: (file: File) => void;
    reorderFiles: (a: any, b: any) => void;
    deleteFile: (file: File) => void;
}

async function pdfFromImage(imageFile : File) {
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
  return (imagePDFFile as File);
}

let contains = (files: File[], file: File) => (files.filter( (file2: File) => (file2.name == file.name)).length > 0);

const FileContext = createContext<ContextProps | undefined>(undefined)

const FileContextWrapper = ({children }: {children: ReactNode}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const addFiles = useCallback(
    async (newFiles : File[], index?) => {
      let updatedFiles = Array.from(uploadedFiles);
      let filesToAdd : File[] = [];
      for (let i=0; i < newFiles.length; i++) {
        if (newFiles[i].type == "image/png" || newFiles[i].type == "image/jpg") {
          newFiles.splice(i, 1, await pdfFromImage(newFiles[i]));
        }
        if (contains(updatedFiles, newFiles[i])) {
          alert(newFiles[i].name + " is the name of an existing file - it will not be uploaded."); 
          newFiles.splice(i, 1); 
          i--;
        }
      }
      
      
      if (index == undefined) {
        updatedFiles = updatedFiles.concat(newFiles);
      } else {
        updatedFiles.splice(index, 0, ...newFiles);
      }
      setUploadedFiles(updatedFiles);
    },
    [uploadedFiles]
  );

  const deleteFile = useCallback(
    async (file: File) => {
      let newFiles = Array.from(uploadedFiles);
      
      for (let i = 0; i < newFiles.length; i++) {
        if (file === newFiles[i]) {
          newFiles.splice(i, 1); 
          break;
        }
      }

      setUploadedFiles(newFiles);
    },
    [uploadedFiles]
  );

  const splitFile = useCallback(
    async (file: File) => {
      let colorNumber = Math.floor(Math.random() * 16777215)
      let document : PDFDocument = await PDFDocument.load(await file.arrayBuffer());
      let splits : File[] = [];
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
        splits.push(blob);
      }
      let index =  uploadedFiles.findIndex((f) => (f == file));
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

async function assemblePDF(files : File[]) {
  if (files.length == 0) {
    return
  }
  let pdfs : PDFDocument[] = await Promise.all(files.map(async (file) => PDFDocument.load(await file.arrayBuffer()))); 
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
  return blob
}
 
export { FileContextWrapper, FileContext, assemblePDF };