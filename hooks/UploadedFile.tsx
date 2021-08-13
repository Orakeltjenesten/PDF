import { PDFDocument } from "pdf-lib";

class UploadedFile {
    file: File;
    name: string;
    PDF : PDFDocument;
    uuid: string;

    constructor(file: File, pdf: PDFDocument) {
        this.file = file;
        this.PDF = pdf;
        this.name = file.name;
        this.uuid = (Math.random() * 10**12).toString() + (Math.random() * 10**12).toString()
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