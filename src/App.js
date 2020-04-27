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

// Modifiche per funzionamento worker react-pdf
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `http://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
			fileFolder: '',

			// Percorso assoluto del file attualmente aperto
			filePath: null
		}

	}

	componentDidMount(){

		// Esperimenti lettura configurazione

		const remote = require('electron').remote;
		const app = remote.app;		
		console.log(app.getPath('userData'))		

		let configFile = path.join(app.getPath('userData'), 'prova.json');

		let data = JSON.stringify({
			fileFolder: 'C:/Users/m.piccinelli/Documents/Progetti/ChartsViewer/charts'
		});
		fs.writeFileSync(configFile, data);

		let readData = JSON.parse(fs.readFileSync(configFile));
		console.log(readData);
		
		this.setState(
			{
				fileFolder: readData.fileFolder
			},
			() => {
				let fileList = this._readDirSubNodes(); 
				console.log("File list", fileList);
		
				this.setState({
					fileList
				});
			}
		)

	}

	/**
	 * Restituisce un array rappresentante il contenuto della cartella passata
	 * come parametro (chiamata ricorsivamente).
	 * @param {*} dirNode 
	 */
	_readDirSubNodes(dirNode){
		
		let {fileFolder} = this.state;
		let parentRelPath = dirNode != null ? dirNode.relPath : null;
		let parentFullPath = path.join(fileFolder, parentRelPath || "")

		let content = [];

		let readFiles = [];
		
		try{
			readFiles = fs.readdirSync(parentFullPath);
		}
		catch (err){
			console.log("Errore lettura dir", parentFullPath, err);
			return [];
		}

		readFiles.forEach(dirElement => {

			let elementRelPath = path.join(parentRelPath || "", dirElement)
			let elementFullPath = path.join(fileFolder, elementRelPath)

			let stats;
			try{
				stats = fs.statSync(elementFullPath);
			}
			catch (err){
				console.log("Errore lettura stats file", elementFullPath, err);
				return;
			}

			if (stats.isDirectory()){
				let newNode = {
					parentRelPath: parentRelPath,
					name: dirElement, 
					relPath: elementRelPath, 
					type: "dir"
				};
				content.push(newNode)
				this._readDirSubNodes(newNode).forEach(item => content.push(item))

			}
			else {
				let newNode = {
					parentRelPath: parentRelPath,
					name: dirElement, 
					relPath: elementRelPath, 
					type: "file"
				};
				content.push(newNode);
			}

		})

		return content;

	}		

	setSelectedNode = (selNode) => {

		if (selNode.type === 'file'){
			this.setState({
				//filePath: path.join(this.state.fileFolder, fileName)	
				filePath: path.join(this.state.fileFolder, selNode.relPath)
			})
		}

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
					this.state.filePath &&
					<Viewer filePath={this.state.filePath}/>
				}
			</div>

			</React.Fragment>

		);

	}

}

export default withStyles(styles)(App);
