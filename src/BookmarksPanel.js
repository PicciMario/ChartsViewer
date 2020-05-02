import React from 'react';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button } from '@material-ui/core';

// Expansion panel styling ----------------------------------------------------

const ExpansionPanel = withStyles({
	root: {
		border: '1px solid rgba(0, 0, 0, .125)',
		boxShadow: 'none',
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
		'&$expanded': {
			//margin: 'auto',
			marginTop: 0
		},
	},
	expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
	root: {
		backgroundColor: 'rgba(0, 0, 0, .03)',
		borderBottom: '1px solid rgba(0, 0, 0, .125)',
		marginBottom: -1,
		minHeight: 40,
		'&$expanded': {
			minHeight: 40,
		},
	},
	content: {
		'&$expanded': {
			margin: '12px 0',
		},
	},
	expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
	root: {
		padding: 2//theme.spacing(2),
	},
}))(MuiExpansionPanelDetails);

// ----------------------------------------------------------------------------

export default function BookmarksPanel(props){

	return (

		<ExpansionPanel>

			<ExpansionPanelSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
				color="primary"
			>
				<Typography>Bookmarks</Typography>
			</ExpansionPanelSummary>

			<ExpansionPanelDetails>
				<div
					style={{
						display: 'flex',
						flexDirection: "column",
						maxHeight: '40vh',
						overflowY:'auto',
						width: '100%'
					}}
				>
				{
					props.bookmarkData.bookmarks 
					&&
					props.bookmarkData.bookmarks.map((bookmark, index) => 
						<Button
							key={'BKM'+index}
							onClick={() => {
								props.setSelectedNode({
									extension: ".pdf",
									name: bookmark.name,
									relPath: bookmark.relPath,
									type: "file"
								})
							}}
						>{bookmark.name}</Button>					
					)
				}
				</div>
			</ExpansionPanelDetails>

		</ExpansionPanel>		

	)

}