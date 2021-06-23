import React, { useCallback, useState, createContext, ReactNode, useContext } from 'react';
import { PDFDocument, PDFPage } from "pdf-lib";


interface ContextProps {
    files: File[];
    addFiles: (n: File[], index?: any) => void;
    splitFile: (index: any) => void;
    reorderFiles: (n: any, m: any) => void;
    deleteFile: (n: File) => void;
}

const FileContext = createContext<ContextProps | undefined>(undefined)

const FileContextWrapper = ({children }: {children: ReactNode}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const addFiles = useCallback(
    (newFiles : File[], index?) => {
      let updatedFiles = Array.from(uploadedFiles);
      let contains = (file: File, files: File[]) => (files.filter( (file2: File) => (file2.name == file.name)).length > 0);
      if (!index) {
        updatedFiles = updatedFiles.concat(newFiles.filter((file: File) => (!contains(file, uploadedFiles))));
      } else {
        updatedFiles.splice(index, 0, ...newFiles);
      }
  
      if (updatedFiles.length != uploadedFiles.length + newFiles.length) {
        alert("It is not allowed to have multiple files with the same name.")
      }
  
      setUploadedFiles(updatedFiles);
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
      addFiles(splits, uploadedFiles.findIndex((f) => (f == file)));
      deleteFile(file);
    },
    [uploadedFiles]
  );

  const reorderFiles = useCallback(
    (from: number, to: number) => {
      if(from > 0 && from < uploadedFiles.length && to > 0 && to < uploadedFiles.length){
        let newFiles = Array.from(uploadedFiles); // Copy the array, as arrays should not be changed directly
        let [deleted] = newFiles.splice(from, 1);
        newFiles.splice(to, 0, deleted);
        setUploadedFiles(newFiles);
      }
    },
    [uploadedFiles]
  );
  const deleteFile = useCallback(
    (file: File) => {
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

  const fileStore = { files: uploadedFiles, addFiles, reorderFiles, splitFile, deleteFile}

  return (
    <FileContext.Provider value={fileStore} >
        {children}
    </FileContext.Provider>
  );
}


const useFileContext = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('Must be used within a file context provider');
  }
  return context;
};

export { FileContextWrapper, FileContext };