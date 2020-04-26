import React from 'react';
import PropTypes from 'prop-types';
import Viewer from './Viewer';
import FilesTree from './FilesTree';
import { Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import path from 'path'
import fs from 'fs'
import os from 'os'

// Modifiche per funzionamento worker react-pdf
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `http://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const drawerWidth = 240;

const styles = (theme) => ({
		
	root: {
		display: 'flex',
	},

	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	
	drawerPaper: {
		width: drawerWidth,
	},

	drawerContainer: {
		overflow: 'auto',
	},	
	
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(3),
	},

});

class App extends React.Component {

		/*
        const { remote } = window.require('electron')
        console.log("appData", remote.app.getPath('appData'))
        console.log("userData", remote.app.getPath('userData'))
		console.log("appPath", remote.app.getAppPath())
		*/

		/*
        fs.readdir(this.state.fileFolder, (err, dir) => {
            for (let filePath of dir) {
                console.log(filePath);
            }
		});
		*/

	static propTypes = {
		classes: PropTypes.object.isRequired,
	};	

	constructor(){
		
		super();

		this.state = {

			// Percorso assoluto della cartella contenente i documenti
			fileFolder: 'C:/Users/mario/Documents/charts-viewer/charts',

			// Percorso assoluto del file attualmente aperto
			filePath: null
		}

	}

	componentDidMount(){
		
		let fileList = this._readDirSubNodes(); 
		console.log("File list", fileList);

		this.setState({
			fileList
		});

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

		fs.readdirSync(parentFullPath).forEach(dirElement => {

			let elementRelPath = path.join(parentRelPath || "", dirElement)
			let elementFullPath = path.join(fileFolder, elementRelPath)

			let stats = fs.statSync(elementFullPath);
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

		const headerHeight = 50;
		const menuWidth = 250;

		return (

			<React.Fragment>

			<div
				style={{
					position: "absolute",
					height: headerHeight,
					left: 0,
					right: 0,
					top: 0,

					backgroundColor: "lightGray",

					display: "flex",
					alignItems: "center"

				}}
			>
				<span
					style={{
						fontSize: "x-large",
						fontWeight: "bold"
					}}
				>
					Charts Viewer
				</span>
			</div>

			<div
				style={{

					position: "absolute",
					top: headerHeight,
					left: 0,
					width: menuWidth,
					bottom: 0,

					overflowX: "hidden",
					overflowY: "auto",

					borderRight: "1px solid darkgray"

				}}
			>
				<FilesTree 
					fileList={this.state.fileList}
					setSelectedNode={this.setSelectedNode}
				/>
			</div>


			<div
				style={{

					position: "absolute",
					top: headerHeight,
					left: menuWidth+5,
					right: 0,
					bottom: 0,

					//overflowX: "auto",
					//overflowY: "auto"					

				}}
			>
				<Viewer filePath={this.state.filePath}/>
			</div>

			</React.Fragment>

		);

	}

	_render(){

		// Classi per gli stili custom
		const {classes} = this.props;

		return (

			<div className={classes.root}>

				<CssBaseline />

				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar variant="dense">
						<Typography variant="h6" noWrap>
							Charts Viewer
						</Typography>
					</Toolbar>
				</AppBar>

				<Drawer
					className={classes.drawer}
					variant="permanent"
					anchor="left"
					classes={{
						paper: classes.drawerPaper,
					}}				
				>
					<Toolbar variant="dense" />
					ciao
					<FilesTree 
						fileList={this.state.fileList}
						setSelectedNode={this.setSelectedNode}
					/>
				</Drawer>

				<main className={classes.content}>
					<Toolbar variant="dense" />
					<Button color="primary">Hello World</Button>
					<Viewer filePath={this.state.filePath}/>
				</main>
			
			</div>

		);
	}
}

export default withStyles(styles)(App);
