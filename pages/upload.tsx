import Head from 'next/head';
import React, {useCallback, useState} from 'react';
import classnames from 'classnames';
import { FileRejection, useDropzone } from 'react-dropzone';
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
import { useTranslation } from 'react-i18next';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            display: 'flex',
        },
        cover: {
            flexGrow: 1,
            color: theme.palette.common.white,
            padding: theme.spacing(2, 2),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            [theme.breakpoints.down('md')]: {
                padding: theme.spacing(2, 1)
            },
        },
        drawer: {
            width: '240px',
            flexShrink: 0,
        },
        drawerPaper: {
            paddingTop: theme.spacing(8),
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
                background: theme.palette.colors.topbar,
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
    const [rejected, setRejected] = useState<FileRejection[] | undefined>(undefined);
    const [hover, setHover] = useState<boolean>(false);
    const { t, i18n } = useTranslation();

    
    const toggleHover = (hover: boolean) => {
        setHover(hover);
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({accept: 'image/jpg, image/png, application/pdf', onDrop: (acceptedFiles, rejectedFiles) => {
      fileContext.addFiles(acceptedFiles);
      if(rejected !== undefined && rejectedFiles.length > 0){
        setRejected(rejectedFiles);
        }
    }})
    return (
        <>
            <Head>
                <title>PDF Application - Upload</title>
                <meta name={t("PDF Application")} content={t("Upload")}/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={classes.root}>
                <div className={classes.cover}>
                    <div onMouseEnter={() => toggleHover(true)} onMouseLeave={() => toggleHover(false)} {...getRootProps()} className={classes.upload}>
                        <Paper className={classnames(isDragActive ? classes.active : undefined, classes.container)}>
                            <input {...getInputProps()} />
                            <FileIcon fontSize='large'/>
                            <Typography variant="h3" textAlign="center">
                                {
                                isDragActive ? t("Drop your files here") : hover ? t("Click to select files") : t("Drag files here, or click to select files")
                                }
                            </Typography>
                        </Paper>
                    </div>
                </div>
                {fileContext.files.length > 0 &&
                    <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="right"
                    >
                    <div className={classes.drawerContainer}>
                        <List>
                        <Typography align='center' variant='h3'>{t("Accepted files")}</Typography>
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
                            <Typography align='center' variant='h3'>{t("Rejected files")}</Typography>
                            {rejected.map((rejection) => (
                                <ListItem button key={rejection.file.name}>
                                <ListItemIcon>{rejection.file.size % 2 === 0 ? <IMGIcon /> : <PDFIcon />}</ListItemIcon>
                                <ListItemText primary={rejection.file.name} />
                                </ListItem>
                            ))}
                        </List>
                        }
                    </div>
                    </Drawer>
                }
            </div>
        </>
    )
}
