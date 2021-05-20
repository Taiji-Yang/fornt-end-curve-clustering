import { Modal } from 'react-bootstrap';
import { Buttonb } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import {  useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import esc from './esc.png'
import Button from '@material-ui/core/Button';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      height: 224,
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  }));

const MyVerticallyCenteredModal = (props) => {

    function getNone(){
        fetch('/deleteall')
        window.location.reload()
    }

    function analysismode(){
      if (window.localStorage.getItem('ifsplit') === 'false'){
        window.localStorage.setItem('ifsplit', true);
      }
      else {
          window.localStorage.setItem('ifsplit', false);
      }
      window.location.reload()
    }
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [state, setSwitchState] = useState({
      time: true,
      xposition: true,
      yposition: true,
      traction: false,
      aflow: false,
      modulenum: false
    });
    const [panel_input, setPanelInput] = useState(['cell_pos_x', 'cell_pos_y', 'time'])
    let nameDict = {
      time: 'time',
      xposition: 'cell_pos_x',
      yposition: 'cell_pos_y',
      traction: 'traction',
      aflow: 'aflow',
      modulenum: 'module_num'
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleSwitchChange = (event) => {
        setSwitchState({...state, [event.target.name]: event.target.checked})
        if (event.target.checked){
          setPanelInput(oldarray => [...oldarray, nameDict[event.target.name]])
        } else {
          const newstate = panel_input.filter((item) => item !== nameDict[event.target.name]);
          setPanelInput(oldarray => newstate)
        }
        props.changeInput(panel_input)
    };
    //console.log(panel_input)
    return (
        
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                <Tab label="tutorial" {...a11yProps(0)} />
                
                {/*
                <Tab label="data" {...a11yProps(1)} />
                <Tab label="clustering" {...a11yProps(1)} />
                <Tab label="algorithm" {...a11yProps(2)} />
                <Tab label="threshold" {...a11yProps(3)} />
                */}
                <Tab label="options" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <ul>
                <li style = {{paddingBottom: '8px'}}>You can rotate the visualization by pressing and <br /> holding the "←" or "→" key on your keyboard </li>
                <li style = {{paddingBottom: '8px'}}>Once you start working on a curve, the other curves <br />will be disabled from being selected</li>
                <li>To clear the scene, please press "Esc" on your keyboard <br /> to open the setting panel and click "CLEAR CANVAS"</li>
              </ul>
              <p  style = {{textAlign: 'right', fontSize: '20px'}}> -- Thanks!</p>
            </TabPanel>
            {/*
            <TabPanel value={value} index={1}>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={state.time}
                                onChange={handleSwitchChange}
                                name="time"
                            />
                        }
                        label="time"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={state.xposition}
                                onChange={handleSwitchChange}
                                name="xposition"
                            />
                        }
                        label="x-position"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={state.yposition}
                                onChange={handleSwitchChange}
                                name="yposition"
                            />
                        }
                        label="y-position"
                    />
                </FormGroup>
                <FormGroup row>
                <FormControlLabel
                        control={
                            <Switch
                                checked={state.traction}
                                onChange={handleSwitchChange}
                                name="traction"
                            />
                        }
                        label="traction"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={state.aflow}
                                onChange={handleSwitchChange}
                                name="aflow"
                            />
                        }
                        label="aflow"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={state.modulenum}
                                onChange={handleSwitchChange}
                                name="modulenum"
                            />
                        }
                        label="module num"
                    />
                </FormGroup>
            </TabPanel>
            
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
            <TabPanel value={value} index={3}>
                Item Four
            </TabPanel>
            */}
            <TabPanel value={value} index={1}>
              <div style = {{height: '50px'}}></div> 
              <div style = {{display:'flex', flexDirection:'row'}}>
              <div style = {{width: '122px'}}></div>
              <Button 
                  variant="outlined" 
                  color="secondary" 
                  style = {{}}
                  onClick={analysismode}
              >
                  switch analysis mode
              </Button>
              </div>
            </TabPanel>
         </div>
         <div style = {{textAlign: 'center'}}>
            <Button 
                variant="outlined" 
                color="secondary" 
                style = {{}}
                onClick={getNone}
            >
                clear canvas
            </Button>
         </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Title id="contained-modal-title-vcenter" size = 'sm'>
            Press <Image src={esc} rounded style = {{width: '40px', height: '40px'}}></Image> to close
          </Modal.Title>
        </Modal.Footer>
      </Modal>
    );
  }

  export default MyVerticallyCenteredModal
