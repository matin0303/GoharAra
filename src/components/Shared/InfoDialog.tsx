import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function InfoDialog({
  openModal,
  setOpenModal,
  title,
  bodyContent,
  footerContent,
  buttonText,
  activeCloseButton,
  closeButtonText,
  buttonAction,
  closeButtonAction,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  buttonText?: string;
  bodyContent: React.ReactNode;
  activeCloseButton?: boolean,
  closeButtonText?: string,
  footerContent?: React.ReactNode;
  buttonAction?: () => void;
  closeButtonAction?: () => void;

}) {
  const handleClickOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    if (closeButtonAction) {
      closeButtonAction();
    } else {
      setOpenModal(false);
    }
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openModal}
        sx={{
          borderRadius: "100px"
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            fontFamily: "kalameh !important",
            fontWeight: "bold",
          }}
          id="customized-dialog-title"
          className="bg-card text-foreground"
        >
          {title}
        </DialogTitle>

        <DialogContent dividers className="bg-card text-foreground">
          <Typography
            gutterBottom
            component="div"
            className="bg-card text-foreground"
            sx={{ fontFamily: "kalameh !important", fontWeight: "bold" }}
          >
            {bodyContent}
          </Typography>
        </DialogContent>
        <DialogActions className="bg-card text-foreground">
          {activeCloseButton &&
            <Button
              autoFocus
              onClick={handleClose}
              className="bg-card text-red-500"
              sx={{ fontFamily: "kalameh !important", fontWeight: "bold", color: "red" }}
            >
              {closeButtonText || "بستن"}
            </Button>
          }

          <Button
            autoFocus
            onClick={buttonAction || handleClose}
            className="bg-card text-foreground"
            sx={{ fontFamily: "kalameh !important", fontWeight: "bold" }}
          >
            {buttonText || "خواندم"}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
