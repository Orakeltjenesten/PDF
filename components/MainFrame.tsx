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

class MainFrame extends React.Component<MainFrameProps, {}> {
    constructor(props: MainFrameProps) {
      super(props);
    }
    
    render() {
      const { classes } = this.props;
      return (
        <MuiContainer className={classes.container} maxWidth={false}>
          <div className={classes.listView}>
            <UploadButton text="Upload PDFs" />
            <PDFsDisplay />
            <SavePDFButton text="Download"/>
          </div>
          <div className={classes.pdfPreview}><PDFPreview file={this.context.selectedFile}/></div>
        </MuiContainer>
      )
    }
  }

export default withStyles(styles)(MainFrame);