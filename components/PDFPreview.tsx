import React, { useContext } from "react";
import { Document, Page, pdfjs } from 'react-pdf'
import { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles, withStyles, WithStyles } from "@material-ui/styles";
import { FileContext, assemblePDF } from "../hooks/FileContext";
import { PDFDocument } from "pdf-lib";
import { FlutterDashTwoTone } from "@material-ui/icons";
import { UploadedFile } from "../hooks/UploadedFile";
import { getTypographyUtilityClass } from "@material-ui/core";


const styles =(theme: Theme) => 
  createStyles({
  documentView : {
    maxHeight: '80vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  pdfPage : {
    position: 'relative',
    margin: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '3px',
  },

  outer : {
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    ['@media (min-width:1000px)']: { // eslint-disable-line no-useless-computed-key
      width: '90%',
      maxWidth: '700px'
    },
    ['@media (max-width:1000px)']: { // eslint-disable-line no-useless-computed-key
      maxWidth: '100%'
    },
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
        bottom: '6px',
        left: '0',
        right: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '4px',
        width: '50px',
        border: '1px solid black',
        background: 'white',
        color: 'black'
      },

      previewText : {
        border: '1px solid black',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: '12px',
        left: '0',
        right: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '4px',
        width: '100%',
        fontSize: '22px',
        backgroundColor: 'white',
        color: 'black',
        maxWidth: '90%'
      },

      hidden : {
        display: 'none'
      },

      pageLoading : {
        position: 'absolute',
        zIndex: -100
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

const PageLoading = (props: {}) => {
  const classes = useStyles({});
  return (
    <div className={classes.pageLoading}>
        Loading...
    </div>
  )
}



interface PDFPreviewProps extends WithStyles<typeof styles> {
  files: UploadedFile[] | undefined,
  currentPage: number | undefined
}

class PDFPreview extends React.Component<PDFPreviewProps, {mergedPDF : UploadedFile | undefined, numberPages : number}> {
  private outerBox: React.RefObject<HTMLDivElement>;
  constructor(props: PDFPreviewProps) {
        super(props);
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        this.state = {
          mergedPDF: undefined,
          numberPages: -1
        }
        this.outerBox = React.createRef<HTMLDivElement>();
    }

    async componentDidUpdate(prevProps : any) {
      if (this.props.files != null && this.props.files != prevProps.files) {
        let file : UploadedFile = (await assemblePDF(this.props.files!))!
        this.setState( {
          mergedPDF : file,
          numberPages: file.getPageCount()
        })
      }
      if (this.props.currentPage != null && this.props.currentPage != prevProps.currentPage) {
        if (this.outerBox.current != null) {
          let outer: HTMLDivElement = this.outerBox.current;
          let doc: HTMLDivElement = (outer.firstChild as HTMLDivElement);
          doc!.children.item(this.props.currentPage)?.scrollIntoView();
        }
      }
    }

    async componentDidMount() {
      if (this.props.files != null) {
        let file : UploadedFile = (await assemblePDF(this.props.files!))!
        this.setState( {
          mergedPDF : file,
          numberPages: file.getPageCount()
        })
      }
    }

    render() {
      const {classes} = this.props;
      return (
        <FileContext.Consumer> 
        { (context: any) => (
        <div className={classes.outer} id="pdfOuter" ref={this.outerBox}>
          
          <Document className={classes.documentView} loading={"Loading"} file={this.state.mergedPDF != null ? this.state.mergedPDF.file : null} noData="">
            {this.state.mergedPDF != null && this.state.numberPages > 0 ? Array.from(Array(this.state.numberPages).keys()).map( (i) => {
            return <Page className={classes.pdfPage} pageNumber={i+1} key={i} width={document.getElementById("pdfOuter")!.offsetWidth-32}> 
              <PageLoading />
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