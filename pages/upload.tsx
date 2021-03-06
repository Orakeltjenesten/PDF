import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import { FileRejection, useDropzone } from 'react-dropzone';
import Paper from '../components/Paper';
import { useFileContext } from '../hooks/FileContext';
import useTranslation from 'next-translate/useTranslation';

// Material UI Components
import { makeStyles, createStyles } from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import { Typography, List, ListItem, ListItemText, Divider, Container, SpeedDial, SpeedDialIcon, SpeedDialAction, Backdrop } from '@material-ui/core'
import { ListItemIcon } from '@material-ui/core';
import PDFIcon from '@material-ui/icons/PictureAsPdfOutlined';
import IMGIcon from '@material-ui/icons/ImageOutlined';
import FileIcon from '@material-ui/icons/DescriptionOutlined';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import MergeIcon from '@material-ui/icons/MergeType';
import SplitIcon from '@material-ui/icons/CallSplit';
import CloseIcon from '@material-ui/icons/Close';
import NextIcon from '@material-ui/icons/NavigateNextTwoTone';
import Link from 'next/link';
import ErrorIcon from '@material-ui/icons/ErrorOutlineTwoTone';
import { PDFDocument } from 'pdf-lib';
import { useAlert } from '../hooks/AlertContext';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flex: 1,
            display: 'flex',
            gap: theme.spacing(2),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(2, 4),
            color: theme.palette.text.primary,
            [theme.breakpoints.down('md')]: {
                padding: theme.spacing(2, 2),
            },
        },
        uploadWrapper: {
            justifyContent: 'center',
            width: '100%',
            maxWidth: theme.breakpoints.values.lg,
        },
        noFiles: {

        },
        upload: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: theme.spacing(10, 5),
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
        filesWrapper: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
            paddingTop: theme.spacing(2),
        },

        acceptedFiles: {
            maxHeight: theme.spacing(32),
            overflowY: 'scroll',
            overflowX: 'hidden',
        },

        rejectedFiles: {
            maxHeight: theme.spacing(32),
            overflowY: 'auto',
            overflowX: 'hidden',
        },

        speedDial: {
            position: 'fixed',
            '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
                bottom: theme.spacing(4),
                right: theme.spacing(4),
            },
        },
    }
    ));


export default function Home() {
    const withLink = (to: string, children: any) => <Link href={to}>{children}</Link>;
    const {showPopup} = useAlert();
    const classes = useStyles();
    const fileContext = useFileContext();
    const [accepted, setAccepted] = useState<File[] | undefined>(undefined);
    const [rejected, setRejected] = useState<FileRejection[] | undefined>(undefined);
    const [hover, setHover] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation('common');

    const actions = [
        { icon: withLink('/merge', <MergeIcon />), name: t("merge") },
        { icon: withLink('/split', <SplitIcon />), name: t("split") },
    ];

    const toggleHover = (hover: boolean) => {
        setHover(hover);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    async function validate(file: File) {
        if (fileContext.files.map(file => file.name).includes(file.name) ||
            fileContext.files.map(file => file.name).includes(file.name + " as pdf.pdf")) {
            return {
                code: t("duplicate_file_code"),
                message: t("already_uploaded_error_message"),
            };
        }
        if (file.type == "application/pdf") {
            let pdf = await PDFDocument.load(await file.arrayBuffer());
            if (pdf.getPageCount() == 0) {
                return {
                    code: t("invalid_file_code"),
                    message: t("invalid_error_message"),
                };
            }
        }

        return null
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/jpeg, image/png, application/pdf', onDrop: async (files) => {
            let rejectedFiles: FileRejection[] = [];
            let acceptedFiles: File[] = [];
            for (let i = 0; i < files.length; i++) {
                let error_message = await validate(files[i]);
                if (error_message != null) {
                    rejectedFiles.push({ file: files[i], errors: [error_message] });
                } else {
                    acceptedFiles.push(files[i]);
                }
            }

            fileContext.addFiles(acceptedFiles);

            if (acceptedFiles.length > 0) {
                if (!accepted) {
                    setAccepted(acceptedFiles);
                }
                else {
                    setAccepted(accepted.concat(acceptedFiles));
                }
            }
            if (rejectedFiles.length > 0) {
                if (!rejected) {
                    setRejected(rejectedFiles);
                }
                else {
                    const currentRejections = rejected;
                    const currentRejectionsNames = currentRejections.map(fileRejection => fileRejection.file.name);
                    rejectedFiles.forEach(fileRejection => {
                        if (!currentRejectionsNames.includes(fileRejection.file.name)) {
                            currentRejections.push(fileRejection);
                        }
                    })
                    setRejected(currentRejections);
                }
            }
        }
    })
    return (
        <>
            <Head>
                <title>{t("upload_title")}</title>
                <meta name={t("meta_name")} content={t("upload")} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={classes.root}>
                <div onMouseEnter={() => toggleHover(true)} onMouseLeave={() => toggleHover(false)} {...getRootProps()} className={classes.uploadWrapper}>
                    <Paper className={classnames(isDragActive ? classes.active : undefined, classes.upload)}>
                        <input {...getInputProps()} />
                        <FileIcon fontSize='large' />
                        <Typography variant="h3" textAlign="center">
                            {
                                isDragActive ? t("drop_here") : hover ? t("click_select") : t("drag_or_select")
                            }
                        </Typography>
                    </Paper>
                </div>
                <Container className={classes.filesWrapper} maxWidth='lg'>
                    {accepted && accepted.length > 0 &&
                        <>
                            <Divider variant='fullWidth' />
                            <List className={classes.acceptedFiles}>
                                <Typography align='center' variant='h3'>{t("accepted_files")}</Typography>
                                {accepted.map((file, index) => (
                                    <ListItem button key={file.name}>
                                        <ListItemIcon>{file.type === 'image/*' ? <IMGIcon /> : file.type === 'application/pdf' ? <PDFIcon /> : <InsertDriveFileOutlinedIcon />}</ListItemIcon>
                                        <ListItemText primary={file.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    }
                    {rejected && rejected.length > 0 &&
                        <>
                            <Divider variant='fullWidth' />
                            <List className={classes.rejectedFiles}>
                                <Typography align='center' variant='h3'>{t("rejected_files")}</Typography>
                                {rejected.map((fileRejection, index) => (
                                    <ListItem button key={fileRejection.file.name}>
                                        <ListItemIcon><ErrorIcon /></ListItemIcon>
                                        <ListItemText primary={fileRejection.file.name} secondary={fileRejection.errors[0].message} />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    }
                </Container>
                <Backdrop open={open} />
                <SpeedDial
                    ariaLabel="SpeedDial openIcon example"
                    className={classes.speedDial}
                    hidden={fileContext.files.length == 0}
                    icon={<SpeedDialIcon icon={<NextIcon />} openIcon={<CloseIcon />} />}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    open={open}
                    direction='up'
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipOpen
                            tooltipTitle={action.name}
                            onClick={handleClose}
                        />
                    ))}
                </SpeedDial>
            </main>
        </>
    )
}
