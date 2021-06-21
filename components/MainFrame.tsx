import { PDFDocument, PDFPage } from "pdf-lib";
import React from "react";
import PDFPreview from "./PDFPreview";
import { PDFsDisplay } from "./PDFsDisplay";
import { SavePDFButton } from "./SavePDFButton";
import { UploadButton } from "./UploadButton";

// Material UI Components
import { withStyles, createStyles, WithStyles }  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import MuiContainer from '@material-ui/core/Container';

const styles = (theme: Theme) => 
  createStyles({
      container: {
          [theme.breakpoints.down('xl')]: {
          paddingRight: theme.spacing(2),
          paddingLeft: theme.spacing(2),
          },
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',

      },
      listView: {
        borderRight: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1',
        maxHeight: '80vh'
      },
      pdfPreview: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1'
      },
});


interface MainFrameProps extends WithStyles<typeof styles>{

};

class MainFrame extends React.Component<MainFrameProps, {files: File[], selectedFile?: File}> {
    constructor(props: MainFrameProps) {
      super(props);
      this.state = {files : [], selectedFile: undefined}
      this.deleteEntry = this.deleteEntry.bind(this);
      this.reorder = this.reorder.bind(this);
      this.updateFiles = this.updateFiles.bind(this);
      this.updateSelected = this.updateSelected.bind(this);
      this.split = this.split.bind(this);
    }
  
    updateFiles(newFiles : File[], position=-1) {
  
      let updatedFiles = Array.from(this.state.files);
      let contains = (file: File, files: File[]) => (files.filter( (file2: File) => (file2.name == file.name)).length > 0);
      if (position == -1) {
        updatedFiles = updatedFiles.concat(newFiles.filter((file: File) => (!contains(file, this.state.files))));
      } else {
        updatedFiles.splice(position, 0, ...newFiles);
      }
  
      if (updatedFiles.length != this.state.files.length + newFiles.length) {
        alert("It is not allowed to have multiple files with the same name.")
      }
  
  
      this.setState(
        {
          files: updatedFiles
        }
      );
    }

  
    async split(file: File) {
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
      this.updateFiles(splits, this.state.files.findIndex((f) => (f == file)));
      this.deleteEntry(file);
    }
      
    updateSelected(newFile : File | undefined) {
        this.setState( 
            {
            selectedFile : newFile!
            }
        )
        console.log(this.state);
    }
  
    reorder(from: number, to: number) {
      let newFiles = Array.from(this.state.files); // Copy the array, as arrays should not be changed directly
      let [deleted] = newFiles.splice(from, 1);
      newFiles.splice(to, 0, deleted);
      this.setState( { // End by updating state with the modified array
        files : newFiles
      })
    }
  
    deleteEntry(file: File) {
      if (this.state.selectedFile == undefined || this.state.selectedFile!.name == file.name) {
        this.updateSelected(undefined);
      }
      
      let newFiles = Array.from(this.state.files);
      for (let i=0; i<newFiles.length; i++) {
        if (file === newFiles[i]) {
          newFiles.splice(i, 1); 
          break;
        }
      }
  
      this.setState( { // End by updating state with the modified array
        files : newFiles
      })
    }
  
    render() {
      const { classes } = this.props;
      return (
        <MuiContainer className={classes.container} maxWidth={false}>
          <div className={classes.listView}>
            <UploadButton text="Upload PDFs" updateFiles={this.updateFiles} />
            <PDFsDisplay reorder={this.reorder} deleteEntry={this.deleteEntry} updateSelected={this.updateSelected} split={this.split} files={this.state.files} />
            <SavePDFButton text="Download" files={this.state.files}/>
          </div>
          <div className={classes.pdfPreview}><PDFPreview file={this.state.selectedFile}/></div>
        </MuiContainer>
      )
    }
  }

export default withStyles(styles)(MainFrame);