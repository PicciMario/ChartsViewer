import React from 'react';

import globalConfig from './GlobalConfig';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import IconButton from '@material-ui/core/IconButton';

const { dialog } = require('electron').remote;

export default class ConfigDialog extends React.Component{

	static propTypes = {

        /** True to show the dialog. */
        open: PropTypes.bool,

        onClose: PropTypes.func.isRequired,

        onSubmit: PropTypes.func.isRequired,
        
    };
    
	static defaultPropTypes = {
		open: false
	}

    // ------------------------------------------------------------------------

    constructor(props){
        
        super(props);

        this.state = {
            
            open: false,

            basePath: null,

        }

    }

    componentDidUpdate(prevProps, prevState){

        if (prevProps.open !== this.props.open){
            
            if (this.props.open === false){
                this.setState({open: false})                
            }
            else {
                this.setState({
                    open: true,
                    basePath: globalConfig.get("basePath")
                })
            }

        }

    }

	/**
	 * Callback when editing base path.
	 */
    handleBasePathChange = (e) => {
        this.setState({basePath: e.target.value})
	}
	
	/**
	 * Handle form submit.
	 */
	handleSubmit = (e) => {
		let keys = {
			basePath: this.state.basePath
		}
		this.props.onSubmit(keys);
	}

	/**
	 * Handle form close.
	 */
	handleClose = (e) => {
		this.props.onClose();
	}

	/**
	 * Selection button on basepath input field.
	 */
	basepathFolderButton = () => 
		<InputAdornment position="start">
			<IconButton onClick={this.handleBasepathFolderButton}>
				<FolderOpenIcon/>
			</IconButton>
		</InputAdornment>	

	/**
	 * Handle selection button on basepath folder input field.
	 */
	handleBasepathFolderButton = () => {

		dialog.showOpenDialog({
			title: "Select documents folder",
			buttonLabel: "Select",
			properties: ['openDirectory']
		})
		.then(result => {

			console.log(result)
		
			if (!result.filePaths || result.filePaths.length === 0) { return; }
			
			this.setState({basePath: result.filePaths[0]});

		})	

	}

    render(){

        return (
            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth={true}>
                <DialogTitle id="form-dialog-title">Application configuration.</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The configuration is saved locally per-user.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="basePath"
                        label="Base document path"
                        helperText="Directory which contains the documents."
                        value={this.state.basePath}
                        onChange={this.handleBasePathChange}
						fullWidth
						InputProps={{
							startAdornment: this.basepathFolderButton(),
						}}						
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>	
        );
    }

}