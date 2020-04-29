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
			fileObject: null

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
			this.updateFileTree
		)

	}

	setSelectedNode = (selNode) => {
		this.setState({
			fileObject: selNode
		})
	}

	handleConfigDialogClose = () => {
		this.setState({dialogOpen: false});
	}

	handleConfigDialogSubmit = (keys) => {

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

		this.setState(newState);

	}	

	render(){

		// Custom styles classnames
		const {classes} = this.props;

		return (

			<React.Fragment>

				<CssBaseline />

				<div className={classes.headerDiv}>
					<Toolbar variant="dense">
						<IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {this.setState({dialogOpen: !this.state.dialogOpen})}}>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" color="inherit">
							Charts Viewer
						</Typography>
					</Toolbar>
				</div>

				<div className={classes.treeDiv}>
					<FilesTree 
						basePath={this.state.basePath}
						setSelectedNode={this.setSelectedNode}
					/>
				</div>

				<div className={classes.viewerDiv}>
					{
						this.state.fileObject &&
						<Viewer 
							fileObject={this.state.fileObject}
							basePath={this.state.basePath}
						/>
					}
				</div>

				<ConfigDialog
					open={this.state.dialogOpen} 
					onClose={this.handleConfigDialogClose}
					onSubmit={this.handleConfigDialogSubmit}
				/>

			</React.Fragment>

		);

	}

}

export default withStyles(styles)(App);
