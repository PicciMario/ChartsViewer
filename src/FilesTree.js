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
		setFilePath: PropTypes.func.isRequired
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

	componentWillReceiveProps(nextProps){
		this.setState({
			fileList: nextProps.fileList
		})
	}

	render(){

		// Classi per gli stili custom
		const {classes} = this.props;

		return (
			<TreeView
				className={classes.root}
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
				onNodeSelect={(event, value) => this.props.setFilePath(value)}
			>
				{
					this.state.fileList != null
					&& this.state.fileList.map(file => 
						<TreeItem nodeId={file} label={file}/>
					)
				}
				<TreeItem nodeId="1" label="Applications">
				<TreeItem nodeId="2" label="Calendar" />
				<TreeItem nodeId="3" label="Chrome" />
				<TreeItem nodeId="4" label="Webstorm" />
				</TreeItem>
				<TreeItem nodeId="5" label="Documents">
				<TreeItem nodeId="10" label="OSS" />
				<TreeItem nodeId="6" label="Material-UI">
				<TreeItem nodeId="7" label="src">
				<TreeItem nodeId="8" label="index.js" />
				<TreeItem nodeId="9" label="tree-view.js" />
				</TreeItem>
				</TreeItem>
				</TreeItem>
			</TreeView>
		);
	}
}

export default withStyles(styles)(FilesTree);