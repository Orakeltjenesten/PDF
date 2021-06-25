import Head from 'next/head';
import React, {useCallback, useState} from 'react';
import classnames from 'classnames';
import { useDropzone } from 'react-dropzone';
import Paper from '../components/Paper';
import { useFileContext } from '../hooks/FileContext';


// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import { Typography, Drawer, List, ListItem, ListItemText, Divider } from '@material-ui/core'
import { ListItemIcon } from '@material-ui/core';
import PDFIcon from '@material-ui/icons/PictureAsPdfOutlined';
import IMGIcon from '@material-ui/icons/ImageOutlined';
import FileIcon from '@material-ui/icons/DescriptionOutlined';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        cover: {
            position: 'relative',
            color: theme.palette.common.white,
            padding: theme.spacing(2, 2),
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            [theme.breakpoints.down('md')]: {
                padding: theme.spacing(2, 1)
            },
        },
        drawer: {
            width: '240px',
            flexShrink: 0,
        },
        drawerPaper: {
            width: '240px',
        },
        drawerContainer: {
            overflow: 'auto',
        },
        upload: {
            [theme.breakpoints.down('lg')]: {
              width: '100%',
            },
            [theme.breakpoints.up('lg')]: {
              width: theme.breakpoints.values.lg,
            },
          },
        container: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: theme.spacing(10,5),
            overflow: 'hidden',
            height: theme.spacing(40),
            border: theme.spacing(.5) + ' dashed ' + theme.palette.colors.topbar,
            '&:hover': {
                cursor: 'pointer',
                
            }
        },
        active: {
            background: theme.palette.colors.topbar,
        },
    }
));


export default function Home() {
    const classes = useStyles();
    const fileContext = useFileContext();
    const [rejected, setRejected] = useState<File[] | undefined>(undefined);

    
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        fileContext.addFiles(acceptedFiles);

        if(rejectedFiles){
            setRejected(Array.from([rejected, rejectedFiles]));
        }
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    return (
        <>
            <Head>
                <title>PDF Application - Upload</title>
                <meta name="PDF Application" content="Upload"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={classes.cover}>
                <div {...getRootProps()} className={classes.upload}>
                    <Paper className={classnames(isDragActive ? classes.active : undefined, classes.container)}>
                        <input {...getInputProps()} />
                        <FileIcon fontSize='large'/>
                        <Typography variant="h3" textAlign="center">
                            {
                            isDragActive ? "Drop your files here" : "Drag files here, or click to select files"
                            }
                        </Typography>
                    </Paper>
                </div>
            </div>
            <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            >
            <div className={classes.drawerContainer}>
                <List>
                {fileContext.files.map((file, index) => (
                    <ListItem button key={file.name}>
                    <ListItemIcon>{index % 2 === 0 ? <IMGIcon /> : <PDFIcon />}</ListItemIcon>
                    <ListItemText primary={file.name} />
                    </ListItem>
                ))}
                </List>
                <Divider />
                {rejected !== undefined && rejected.length > 0 && 
                <List>
                    
                </List>
                }
            </div>
            </Drawer>
        </>
    )
}
