import React from "react";
import { Document, Page, pdfjs } from 'react-pdf'
import { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles, withStyles, WithStyles } from "@material-ui/styles";
import { FileContext, assemblePDF } from "../hooks/FileContext";
import { PDFDocument } from "pdf-lib";


const styles =(theme: Theme) => 
  createStyles({
  documentView : {
    overflowY: 'scroll',
    maxHeight: '80vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  },

  pdfPage : {
    position: 'relative',
    margin: '7px',
    border: '1px solid black'
  },

  outer : {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    minWidth: '500px'
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

const PreviewText = (props: {text: string}) => {
  const classes = useStyles({});
  return (
    <div className={classes.previewText}>
        {props.text}
    </div>
  )
}



interface PDFPreviewProps extends WithStyles<typeof styles> {
  files: File[] | undefined
}

class PDFPreview extends React.Component<PDFPreviewProps, {mergedPDF : File | undefined, pageNumber : number, numberPages : number}> {
    constructor(props: PDFPreviewProps) {
        super(props);
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        this.state = {
          mergedPDF: undefined,
          pageNumber: 1,
          numberPages: -1
        }
    }

    async componentDidUpdate(prevProps : any) {
      if (this.props.files != null && this.props.files != prevProps.files) {
        let file : File = await assemblePDF(this.props.files!)
        this.setState( {
          mergedPDF : file
        })
      }
    }

    async componentDidMount() {
      if (this.props.files != null) {
        let file : File = await assemblePDF(this.props.files!)
        this.setState( {
          mergedPDF : file
        })
      }
    }



    render() {
      const {classes} = this.props;
      return (
        <FileContext.Consumer> 
        { (context: any) => (
        <div className={classes.outer}>
          <Document className={classes.documentView} loading={"Laster..."} file={this.state.mergedPDF} onLoadSuccess={(pdf) => {this.setState({numberPages : pdf.numPages}); if (pdf.numPages == 0) {alert("Corrupted or empty PDF!")}}} noData="">
            
            {this.state.mergedPDF != null && this.state.numberPages > 0 ? Array.from(Array(this.state.numberPages).keys()).map( (i) => {
            return <Page className={classes.pdfPage} pageNumber={i+1} key={i}>
              
              <PreviewControls page={i+1} />
            </Page>
          }) : <div />}
          
          </Document>
          <PreviewText text="Preview" />
          </div>
        )}
          </FileContext.Consumer>
      )
    }
  }

  export default withStyles(styles)(PDFPreview);