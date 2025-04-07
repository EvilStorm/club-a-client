import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function SimpleConfirmPopup({ open, onClose, message }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md")); // md 사이즈 이하에서는 fullScreen 적용

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      aria-describedby="responsive-dialog-description"
      maxWidth="md" // 기본 최대 너비 설정 (조절 가능)
      PaperProps={{
        style: {
          minWidth: fullScreen ? "100%" : "25vw", // 화면 너비의 1/4 (viewport width)
        },
      }}
    >
      <DialogTitle id="responsive-dialog-title">알림</DialogTitle>
      <DialogContent>
        <Typography id="responsive-dialog-description">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SimpleConfirmPopup;
