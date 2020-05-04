import React from 'react';
import PropTypes from 'prop-types';
import Viewer from './Viewer';
import FilesTree from './FilesTree';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import globalConfig from './GlobalConfig';
import ConfigDialog from './ConfigDialog';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import * as FileUtilities from './FileUtilities';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Component styles -----------------------------------------------------------

const headerHeight = 45;
const menuWidth = 250;

const styles = (theme) => ({
		
	root: {
		display: 'flex',
	},

	headerDiv: {
		position: "absolute",
		height: headerHeight,
		left: 0,
		right: 0,
		top: 0,
		display: "flex",
		alignItems: "center",
		backgroundColor: "#4ab1b9"
	},
	
	treeDiv: {
		position: "absolute",
		top: headerHeight,
		left: 0,
		width: menuWidth,
		bottom: 0,

		overflowX: "hidden",
		overflowY: "auto",

		borderRight: "1px solid darkgray"
	},
	
	viewerDiv: {
		position: "absolute",
		top: headerHeight,
		left: menuWidth+5,
		right: 0,
		bottom: 0,
	},

});

// ----------------------------------------------------------------------------
class App extends React.Component {

	static propTypes = {
		classes: PropTypes.object.isRequired,
	};	

	constructor(){
		
		super();

		this.state = {

			// Percorso assoluto della cartella contenente i documenti
			basePath: '',

			// Percorso assoluto del file attualmente aperto
			fileObject: null,

			// True to show config dialog
			dialogOpen: false,

			// True to show application main menu
			menuOpen: false,

			// States to manage snackbar
			snackbarOpen: false,
			snackbarText: '',
			snackbarSeverity: "success",

			fileList: [],
			bookmarkData: {}

		}

		/*
		// Remove default window menubar.
		const remote = require('electron').remote;
		const Menu = remote.Menu;
		Menu.setApplicationMenu(null);	
		*/

	}

	componentDidMount(){

		//globalConfig.set('basePath', 'C:/Users/m.piccinelli/Documents/Progetti/ChartsViewer/charts');

		this.setState(
			{
				basePath: globalConfig.get("basePath", null)
			},
			() => this.updateFileTree(this.state.basePath)
		)

	}

	updateFileTree(basePath){

		if (basePath == null) return;

		console.log("Calling updateFileTree...")

		new Promise((res, rej) => {
			let fileList = FileUtilities.readDirTree(basePath);
			res(fileList);
		})
		.then((fileList) => {
			if (fileList != null){
				this.showSuccess(`Read ${fileList.length} files/dirs from: ${basePath}`)
				this.setState({
					fileList
				});			
			}
			else {
				this.showError(`Unable to read files/dirs from: ${basePath}`);
				this.setState({
					fileList: []
				});					
			}
		})

		new	Promise((res, rej) => {
			try{
				let bookmarkData = FileUtilities.readBookmarksFile(basePath);
				res(bookmarkData)
			}
			catch (err){
				rej("Error while reading bookmarks: " + err)
			}			
		})
		.then((bookmarkData) => {
			this.setState({bookmarkData})
		})
		.catch((e) => {
			this.setState({bookmarkData: {}})
			console.error("Error while reading bookmarks", e);
		})

	}		

	setSelectedNode = (selNode) => {
		this.setState({
			fileObject: selNode
		})
	}

	/**
	 * Handles opening the config dialog.
	 * (also closes main menu).
	 */
	handleConfigDialogOpen = () => {
		this.setState({
			dialogOpen: !this.state.dialogOpen, 
			anchorEl: null, 
			menuOpen: false
		})
	}

	/**
	 * Handles closing the config dialog.
	 */
	handleConfigDialogClose = () => {
		this.setState({dialogOpen: false});
	}

	/**
	 * Handles submitting the config dialog. Expects an object
	 * with the config keys. Saves the keys in the config object
	 * and, if required (by a change in basePath, for example), 
	 * updates the component state to force a refresh.
	 */
	handleConfigDialogSubmit = (keys) => {

		console.log("dialog submit", keys, this.state)

		let newState = {dialogOpen: false};

		if (keys != null){
			
			Object.keys(keys).forEach(key => {

				globalConfig.set(key, keys[key]);

				// Upgrade basePath in component's state
				// to force refresh.
				if (
					key === 'basePath'
					&& keys[key] !== this.state.basePath
				) {
					newState[key] = keys[key];
					newState.fileObject = null;
				}

			})

		}

		console.log("setting newstate", newState)
		this.setState(
			newState,
			() => this.updateFileTree(this.state.basePath)
		);

	}	

	/**
	 * Handles opening the main menu.
	 */
	handleMenuOpen = (event) => {
		this.setState({
			anchorEl: event.currentTarget,
			menuOpen: true
		});
	};

	/**
	 * Handles closing the main menu.
	 */
	handleMenuClose = () => {
		this.setState({
			anchorEl: null,
			menuOpen: false
		});
	};

	/**
	 * Handles the "quit" option in the main menu.
	 */
	handleQuit = () => {
		require("electron").remote.app.quit();
	}

	/**
	 * Show success snackbar.
	 * @param text Message to show.
	 */
	showSuccess = (text) => {
		this.setState({
			snackbarOpen: true,
			snackbarText: text,
			snackbarSeverity: "info"
		})
	}

	/**
	 * Show error snackbar.
	 * @param text Message to show.
	 */	
	showError = (text) => {
		this.setState({
			snackbarOpen: true,
			snackbarText: text,
			snackbarSeverity: "error"
		})
	}	

	/**
	 * Closes snackbar.
	 */
	handleSnackbarClose = () => {
		this.setState({snackbarOpen: false})
	}

	// ------------------------------------------------------------------------

	render(){

		// Custom styles classnames
		const {classes} = this.props;

		return (

			<React.Fragment>

				<CssBaseline />

				<div className={classes.headerDiv}>
					<Toolbar variant="dense">

						<div>

							<IconButton
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={this.handleMenuOpen}
								color="inherit"
							>
								<MenuIcon />
							</IconButton>	

							<Menu
								id="menu-appbar"
								anchorEl={this.state.anchorEl}
								getContentAnchorEl={null}
								keepMounted
								anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
								transformOrigin={{ vertical: "top", horizontal: "center" }}
								open={this.state.menuOpen}
								onClose={this.handleMenuClose}
							>
								<MenuItem onClick={this.handleConfigDialogOpen}>Configure...</MenuItem>
								<MenuItem onClick={this.handleQuit}>Quit</MenuItem>
							</Menu>	

						</div>

						<Typography variant="h6" color="inherit">
							Charts Viewer
						</Typography>

					</Toolbar>
				</div>

				<div className={classes.treeDiv}>
					<FilesTree 
						basePath={this.state.basePath}
						setSelectedNode={this.setSelectedNode}
						showSuccess={this.showSuccess}
						showError={this.showError}
						bookmarkData={this.state.bookmarkData}
						fileList={this.state.fileList}
					/>
				</div>

				<div className={classes.viewerDiv}>
					{
						this.state.fileObject &&
						<Viewer 
							fileObject={this.state.fileObject}
							basePath={this.state.basePath}
							showSuccess={this.showSuccess}
							showError={this.showError}							
						/>
					}
				</div>

				<ConfigDialog
					open={this.state.dialogOpen} 
					onClose={this.handleConfigDialogClose}
					onSubmit={this.handleConfigDialogSubmit}
				/>

				<Snackbar open={this.state.snackbarOpen} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
					<Alert onClose={this.handleSnackbarClose} severity={this.state.snackbarSeverity}>
						{this.state.snackbarText}
					</Alert>
				</Snackbar>				

			</React.Fragment>

		);

	}

}

export default withStyles(styles)(App);
