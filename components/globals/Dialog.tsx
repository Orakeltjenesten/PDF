import { ReactNode } from 'react';

// Material-ui
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import { Button, Dialog as MaterialDialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';
const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    contentText: {
      color: theme.palette.text.secondary,
    },
    paper: {
      background: theme.palette.background.paper,
    },
}));

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  titleText?: string;
  children?: ReactNode;
  contentText?: string;
  closeText?: string;
  confirmText?: string;
  disabled?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
};

const Dialog = ({
  maxWidth = 'md',
  fullWidth = true,
  open,
  onClose,
  onCancel,
  onConfirm,
  titleText,
  children,
  contentText,
  closeText,
  confirmText,
  disabled = false,
}: DialogProps) => {
  const classes = useStyles();
  const { t } = useTranslation("common");
  return (
    <MaterialDialog
      aria-labelledby='form-dialog-title'
      classes={{ paper: classes.paper }}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={onClose}
      open={open}>
      {titleText && <DialogTitle id='form-dialog-title'>{titleText}</DialogTitle>}
      {(contentText || children) && (
        <DialogContent>
          {contentText && <DialogContentText className={classes.contentText}>{contentText}</DialogContentText>}
          {children}
        </DialogContent>
      )}
      <DialogActions>
        <Button color='primary' onClick={onCancel || onClose} variant='text'>
          {closeText || t("close")}
        </Button>
        {onConfirm && (
          <Button color='primary' disabled={disabled} onClick={onConfirm || onCancel} variant='text'>
            {confirmText || t("ok")}
          </Button>
        )}
      </DialogActions>
    </MaterialDialog>
  );
};

export default Dialog;
