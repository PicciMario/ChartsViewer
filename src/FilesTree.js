import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = (theme) => ({

	root: {
		height: 240,
		width: 240,
		flexGrow: 1,
		maxWidth: 400,
	},

});
  
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

	renderDirContent(dirItems, parentRelPath = null){
		
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

			if (a.name > b.name) return 1;
			else if (a.name < b.name) return -1;
			else return 0;

		})
		.forEach(dirItem => {
			switch (dirItem.type){

				case "file":
					ritorno.push(<TreeItem key={dirItem.relPath} nodeId={dirItem.relPath} label={dirItem.name}/>);
					break;

				case "dir":
					ritorno.push(
						<TreeItem key={dirItem.relPath} nodeId={dirItem.relPath} label={dirItem.name}>
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

	render(){

		// Classi per gli stili custom
		const {classes} = this.props;

		return (
			<TreeView
				className={classes.root}
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
				onNodeSelect={(event, value) => {
					this.props.setSelectedNode(this.state.fileList.find(item => item.relPath === value));
				}}
			>

				{this.renderDirContent(this.state.fileList)}

			</TreeView>
		);
	}
}

export default withStyles(styles)(FilesTree);