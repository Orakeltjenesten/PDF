import { FieldExistsAsNonTerminalError, PDFDocument, toUint8Array } from "pdf-lib";
import React from "react";
import { Document, Page, pdfjs } from 'react-pdf'
import { fileSave } from "browser-fs-access";
import { ThirtyFpsSelect } from "@material-ui/icons";
import { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles, withStyles, WithStyles } from "@material-ui/styles";


const styles =(theme: Theme) => 
  createStyles({
       
  documentView : {
    overflowY: 'scroll',
    maxHeight: '80vh',
    position: 'relative'
  },

  pdfPage : {
    position: 'relative',
    margin: '7px',
    border: '1px solid black'
  },

  outer : {
    position: 'relative'
}

});

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      controls : {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: '0',
        left: '0',
        right: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '4px',
        width: '200px'
      },

      previewText : {
        border: '1px solid black',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: '7px',
        left: '0',
        right: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '4px',
        width: '500px',
        fontSize: '22px',
        backgroundColor: 'white'
      },

      hidden : {
        display: 'none'
      }
    }));



const PreviewControls = (props: {page: number}) => {
  const classes = useStyles({});
    return (
      <div className={classes.controls}>
        {props.page}
      </div>
    )
}

const PreviewText = (props: {file : File | undefined}) => {
  const classes = useStyles({});
  return (
    <div className={`${classes.previewText} ${props.file == null? classes.hidden : classes.previewText}`}>
        {props.file != null ? props.file!.name : ""}
    </div>
  )
}



interface PDFPreviewProps extends WithStyles<typeof styles> {
  file: File | undefined
}

class PDFPreview extends React.Component<PDFPreviewProps, {pageNumber : number, numberPages : number}> {
    constructor(props: PDFPreviewProps) {
        super(props);
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
        this.state = {
          pageNumber: 1,
          numberPages: 0
        }
    }

    componentDidUpdate(prevProps : any) {
      if (this.props.file != prevProps.file) {
        this.setState({
          pageNumber: 1
        }
        )
      }
    }

    async incrementPage(amount: number) {
      if (this.props.file == null) {
        return
      }

      if (this.state.pageNumber + amount > 0 && this.state.pageNumber + amount <= this.state.numberPages) {
        this.setState({
          pageNumber : this.state.pageNumber + amount
        })
    }
    }

    pages() {
      
      
      }


    render() {
      const {classes} = this.props;
      return (
        <div className={classes.outer}>
          <Document className={classes.documentView} file={this.props.file} onLoadSuccess={(pdf) => (this.setState({ numberPages : pdf.numPages}))} noData="">
            
            {Array.from(Array(this.state.numberPages).keys()).map( (i) => {
            return <Page className={classes.pdfPage} pageNumber={i+1}>
              
              <PreviewControls page={i+1} />
            </Page>
          })}
          
          </Document>
          <PreviewText file={this.props.file} />
          </div>
      ) 
    }
  }

  export default withStyles(styles)(PDFPreview);