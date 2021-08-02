import { PDFDocument } from "pdf-lib";

class UploadedFile {
    file: File;
    name: string;
    PDF : PDFDocument;

    constructor(file: File, pdf: PDFDocument) {
        this.file = file;
        this.PDF = pdf;
        this.name = file.name;
    }

    getPageCount() {
        return this.PDF.getPageCount();
    }

    getPage(i: number) {
        return this.PDF.getPage(i);
    }

    getTotalHeight() {
        var totalHeight = 0;
        this.PDF.getPages().forEach((page) => {totalHeight += page.getHeight()});
        return totalHeight;
    }
}

export {UploadedFile};