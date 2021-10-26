import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {AppBar, Container} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontSize: 30,
    textAlign: "center"
  },
}));

export default function Navbar({account,result}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // result ? id="#add": alert("Nikal laude");

  return (
    <Container>
    <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor:"primary"}}>
        <Toolbar>
        <Button style={{color: "White"}} href="#add" variant="outlined">Candidate</Button>
          <Typography variant="h6" className={classes.title}>
          DappVote
          </Typography>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            style={{color: "White", fontSize:"12"}}
            variant="outlined"
          >
            Details
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>Owner Name: ituwei</MenuItem>
            <MenuItem>Address: {account}</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
    </Container>
  );
}