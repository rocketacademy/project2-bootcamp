import React from "react";

import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import Popper from "@mui/material/Popper";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkIcon from "@mui/icons-material/Link";

const SharePopperButton = ({ handleShare, item }) => {
  return (
    <PopupState variant="popper" popupId="demo-popup-popper">
      {(popupState) => (
        <div>
          <IconButton color="inherit" {...bindToggle(popupState)}>
            <ShareIcon />
          </IconButton>
          <Popper {...bindPopper(popupState)} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <List dense={true}>
                    <ListItemButton
                      id="facebook"
                      onClick={(event) => handleShare(event, item)}
                    >
                      <ListItemIcon>
                        <FacebookIcon />
                      </ListItemIcon>
                      <ListItemText primary="Facebook" />
                    </ListItemButton>

                    <ListItemButton
                      id="copy"
                      onClick={(event) => handleShare(event, item)}
                    >
                      <ListItemIcon>
                        <LinkIcon />
                      </ListItemIcon>
                      <ListItemText primary="Copy Link" />
                    </ListItemButton>
                  </List>
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
      )}
    </PopupState>
  );
};

export default SharePopperButton;
