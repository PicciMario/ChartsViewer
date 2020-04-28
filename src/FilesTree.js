import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Component styles -----------------------------------------------------------

const styles = (theme) => ({

	root: {
		height: 240,
		width: 240,
		flexGrow: 1,
		maxWidth: 400,
	},

	treeItemLabel: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap"
	}

});

// ----------------------------------------------------------------------------  
class FilesTree extends React.Component {

	static propTypes = {
		classes: PropTypes.object.isRequired,
		fileList: PropTypes.array,
		setSelectedNode: PropTypes.func.isRequired
	};

	static defaultPropTypes = {
		fileList: []
	}

	constructor(props){
		super(props);
		this.state = {
			fileList: props.fileList
		}
	}

	componentDidUpdate(prevProps, prevState){
		if (this.props.fileList !== prevProps.fileList){
			this.setState({
				fileList: this.props.fileList
			})
		}
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
		let fileObject = this.state.fileList.find(item => item.relPath === value);
		if (fileObject !== null && fileObject.type === 'file'){
			this.props.setSelectedNode(fileObject);
		}
	}

	render(){

		// Custom styles classnames
		const {classes} = this.props;

		return (

			<TreeView
				className={classes.root}
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
				onNodeSelect={this.onNodeSelect}
			>

				{this.renderDirContent(this.state.fileList)}

			</TreeView>

		);
	}
}

export default withStyles(styles)(FilesTree);