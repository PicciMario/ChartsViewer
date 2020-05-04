import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import BookmarksPanel from './BookmarksPanel';

// Component styles -----------------------------------------------------------

const styles = (theme) => ({

	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},

	filesTree: {
		//height: 240,
		//width: 240,
		//flexGrow: 1,
		//maxWidth: 400,
	},

	treeviewDiv: {
		flexGrow: 1,
		overflowY: 'auto'
	},

	treeItemLabel: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap"
	},

});

// ----------------------------------------------------------------------------  
class FilesTree extends React.Component {

	static propTypes = {
		classes: PropTypes.object.isRequired,
		basePath: PropTypes.string,
		setSelectedNode: PropTypes.func.isRequired,
		showSuccess: PropTypes.func,
		showError: PropTypes.func,
		fileList: PropTypes.array,
		bookmarkData: PropTypes.object
	};

	static defaultPropTypes = {
		basePath: null,
		showSuccess: () => {},
		showError: () => {},
		fileList: [],
		bookmarkData: {}
	}

	/**
	 * Tree items renderer. Renders the tree items from the list who have
	 * the parent "parentRelPath".
	 * @param {*} dirItems 
	 * @param {*} parentRelPath 
	 */
	renderDirContent(dirItems, parentRelPath = null){
		
		// Custom styles classnames
		const {classes} = this.props;

		let ritorno = [];

		if (dirItems == null) return ritorno;
		
		dirItems
		.filter(item => item.parentRelPath === parentRelPath)
		.sort((a,b) => {

			// dirs before files
			if (a.type !== b.type){
				if (a.type === 'dir') return -1;
				else return 1;
			}

			// Alphabetical sort
			if (a.name > b.name) return 1;
			else if (a.name < b.name) return -1;
			else return 0;

		})
		.forEach(dirItem => {
			switch (dirItem.type){

				case "file":
					ritorno.push(
						<TreeItem 
							key={dirItem.relPath} 
							nodeId={dirItem.relPath} 
							label={dirItem.name}
							classes={{
								label: classes.treeItemLabel
							}}
							title={dirItem.relPath}
						/>
					);
					break;

				case "dir":
					ritorno.push(
						<TreeItem 
							key={dirItem.relPath} 
							nodeId={dirItem.relPath} 
							label={dirItem.name}
							classes={{
								label: classes.treeItemLabel
							}}	
							title={dirItem.relPath}						
						>
							{this.renderDirContent(dirItems, dirItem.relPath)}
						</TreeItem>
					);
					break;

				default:
					break;

			}
		})

		return ritorno;

	}

	/**
	 * Node selection callback.
	 */
	onNodeSelect = (event, value) => {
		let fileObject = this.props.fileList.find(item => item.relPath === value);
		if (fileObject !== null && fileObject.type === 'file'){
			this.props.setSelectedNode(fileObject);
		}
	}

	render(){

		const {classes, bookmarkData, fileList} = this.props;

		return (

			<div className={classes.root}>

				<div className={classes.treeviewDiv}>
					<TreeView
						className={classes.filesTree}
						defaultCollapseIcon={<ExpandMoreIcon />}
						defaultExpandIcon={<ChevronRightIcon />}
						onNodeSelect={this.onNodeSelect}
					>

						{this.renderDirContent(fileList)}

					</TreeView>
				</div>

				<Divider />

				<BookmarksPanel 
					bookmarkData={bookmarkData}
					setSelectedNode={this.props.setSelectedNode}
				/>

			</div>
		);
	}
}

export default withStyles(styles)(FilesTree);