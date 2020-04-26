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
		
		this.setState({
			fileList: this._readDirStruct(this.state.fileFolder)
		})

	}

	/**
	 * Restituisce un array rappresentante il contenuto della cartella passata
	 * come parametro (chiamata ricorsivamente).
	 * @param {*} basePath 
	 */
	_readDirStruct__(basePath){
		
		let content = [];

		fs.readdir(basePath, (err, dirElements) => {
			
			dirElements.forEach(dirElement => {

				let elementPath = path.join(basePath, dirElement)
				fs.stat(elementPath, (err, stats) => {
					if (stats.isDirectory()){
						content.push({name: dirElement, fullpath: elementPath, type: "dir", children: this._readDirStruct(elementPath)})
					}
					else {
						content.push({name: dirElement, fullpath: elementPath, type: "file"});
					}
				})

			})

		})		

		return content;

	}

	/**
	 * Restituisce un array rappresentante il contenuto della cartella passata
	 * come parametro (chiamata ricorsivamente).
	 * @param {*} basePath 
	 */
	_readDirStruct(basePath){
		
		let content = [];

		fs.readdirSync(basePath).forEach(dirElement => {

			let elementPath = path.join(basePath, dirElement)
			let stats = fs.statSync(elementPath);
			if (stats.isDirectory()){
				content.push({name: dirElement, fullPath: elementPath, type: "dir", children: this._readDirStruct(elementPath)})
			}
			else {
				content.push({name: dirElement, fullPath: elementPath, type: "file"});
			}

		})

		return content;

	}	

	setFilePath = (filePath) => {
		this.setState({
			//filePath: path.join(this.state.fileFolder, fileName)	
			filePath
		})
	}

	render(){

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
						setFilePath={this.setFilePath}
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
