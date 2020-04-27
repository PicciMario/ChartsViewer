import React from 'react';
import PropTypes from 'prop-types';
import Viewer from './Viewer';
import FilesTree from './FilesTree';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import path from 'path'
import fs from 'fs'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import * as FileUtilities from './FileUtilities';

// Costruzione stili per home -------------------------------------------------

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

		//overflowX: "auto",
		//overflowY: "auto"	
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

	}

	componentDidMount(){

		// Esperimenti lettura configurazione

		const remote = require('electron').remote;
		const app = remote.app;		
		console.log(app.getPath('userData'))		

		let configFile = path.join(app.getPath('userData'), 'prova.json');

		let data = JSON.stringify({
			basePath: 'C:/Users/mario/Documents/charts-viewer/charts'
		});
		fs.writeFileSync(configFile, data);

		let readData = JSON.parse(fs.readFileSync(configFile));
		console.log(readData);
		
		this.setState(
			{
				basePath: readData.basePath
			},
			() => {
				let fileList = FileUtilities.readDirTree(this.state.basePath);
				console.log("File list", fileList);
		
				this.setState({
					fileList
				});
			}
		)

	}

	setSelectedNode = (selNode) => {
		this.setState({
			fileObject: selNode
		})
	}

	render(){

		// Classi per gli stili custom
		const {classes} = this.props;

		return (

			<React.Fragment>

			<CssBaseline />

			<div className={classes.headerDiv}>
				<Toolbar variant="dense">
					<IconButton edge="start" color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" color="inherit">
						Charts Viewer
					</Typography>
				</Toolbar>
			</div>

			<div className={classes.treeDiv}>
				<FilesTree 
					fileList={this.state.fileList}
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

			</React.Fragment>

		);

	}

}

export default withStyles(styles)(App);
