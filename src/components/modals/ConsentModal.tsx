import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import localForage from "localforage";
import { useTheme } from "@mui/material";
const generalLocal = localForage.createInstance({
  name: "q-blog-general"
});

export default function ConsentModal() {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const getIsConsented = React.useCallback(async () => {
    try {
      const hasConsented = await generalLocal.getItem("general-consent");
      if (hasConsented) return;

      setOpen(true);
      generalLocal.setItem("general-consent", true);
    } catch (error) {}
  }, []);

  React.useEffect(() => {
    getIsConsented();
  }, []);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Welcome</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            RockyMountainTrade is not responsible for what its members publish within its Shops.
            RockyMountainTrade Shops are Powered By Qortal - 100% decentralized digital infrastructure.
            This means that nothing within an RMT Shop can be modified by anyone other than the shop owner.
            This also means that no one can be held responsible for what is published other than the owner.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.text.primary,
              fontFamily: "Raleway"
            }}
            onClick={handleClose}
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
