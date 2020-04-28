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
import * as FileUtilities from './FileUtilities';
import globalConfig from './GlobalConfig';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

		this.refs.configForm = React.createRef();

	}

	componentDidMount(){

		//globalConfig.set('basePath', 'C:/Users/m.piccinelli/Documents/Progetti/ChartsViewer/charts');

		
		this.setState(
			{
				basePath: globalConfig.get("basePath")
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

	handleClose = () => {
		this.setState({dialogOpen: false});
	}

	handleConfigSave = (e) => {
		console.log(e)
		this.setState({dialogOpen: false});
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

				<Dialog open={this.state.dialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth="true">
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
							defaultValue={globalConfig.get("basePath")}
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handleConfigSave} color="primary">
							Save
						</Button>
					</DialogActions>
				</Dialog>				

			</React.Fragment>

		);

	}

}

export default withStyles(styles)(App);
