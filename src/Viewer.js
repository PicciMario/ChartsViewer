import React from 'react';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf';
import { Button } from '@material-ui/core';
import path from 'path';
import { withStyles } from '@material-ui/core/styles';
import {Slider} from '@material-ui/core';

// Component styles -----------------------------------------------------------

const headerHeight = 50;
const pageSliderWidth = 50;

const styles = (theme) => ({

	headerDiv: {
		position: "absolute",
		top: 0,
		height: headerHeight,
		left: 0,
		right: 0
	},

	viewerDiv: {
		position: "absolute",
		top: headerHeight,
		bottom: 0,
		left: pageSliderWidth,
		right: 0,
		overflowX: "auto",
		overflowY: "auto",
		display:'flex',
		flexDirection: "column"
	},

	pageSliderDiv: {
		position: "absolute",
		left: 5,
		top: headerHeight + 25,
		bottom: 30
	}

});

// ----------------------------------------------------------------------------

class Viewer extends React.Component {

	static propTypes = {
		fileObject: PropTypes.object,
		basePath: PropTypes.string.isRequired
	};

	static defaultPropTypes = {
		fileObject: null
	}

    constructor(props){

        super(props);

        this.state = {
            numPages: null,
			pageNumber: 1,
			scale: 1.0,
			fileObject: props.fileObject,
			basePath: props.basePath,
			dragging: false
		}

		this.viewerDiv = React.createRef();
		
	}

	componentDidMount() {

		// NB: il listener sulla rotella del mouse deve essere creato alla vecchia maniera
		// sul DOM per poter utilizzare l'opzione passive a false. Questa è resa necessaria 
		// da un recente update di Chrome che considera i movimenti della rotella come passivi, 
		// e impedisce il preventDefault a livello di documento.
		if (this.viewerDiv.current) {
			this.viewerDiv.current.addEventListener('mousewheel', this.handleWheel, { passive: false});
		}

	}

	componentWillUnmount() {
		if (this.viewerDiv.current) {
			this.viewerDiv.current.removeEventListener('mousewheel', this.handleWheel);
		}
	}	

	
	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.fileObject !== this.state.fileObject){
			this.setState({
				fileObject: this.props.fileObject,
				pageNumber: 1,
				scale: 1.0
			})
		}
	}

	/**
	 * Callback caricamento PDF.
	 */
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ 
			numPages,
			pageNumber: 1
		});
	}
	
	/**
	 * Callback gestione rotella mouse su viewer.
	 * Modifica la scalatura del documento.
	 */
	handleWheel = (e) => {
		
		e.preventDefault();

		let deltaScale = - e.deltaY / 100. / 5.;
		let newScale = this.state.scale + deltaScale;

		newScale = Math.max(newScale, 0.1);
		newScale = Math.min(newScale, 10);

		this.setState({scale: newScale})

	}	

	/**
	 * Callback gestione movimento mouse sul viewer.
	 * Gestisce drag.
	 */
	handleMouseMove = (e) => {

		if (this.state.dragging === false) return;

		let div = this.viewerDiv.current;
		if (div == null) return;
		div.scrollTo(
			div.scrollLeft - e.movementX,
			div.scrollTop - e.movementY
		)

	}

	/**
	 * Enables drag.
	 * Callback for mouse down on viewer.
	 */
	enableDrag = (e) => {
		// prevents text selection while panning
		e.preventDefault();		
		this.setState({dragging: true});
	}

	/**
	 * Disables drag.
	 * Callback for mouse up/out from viewer.
	 */	
	disableDrag = (e) => {
		this.setState({dragging: false});
	}

	// ------------------------------------------------------------------------

    render() {

		// Custom styles classnames
		const {classes} = this.props;		

		if (
			this.state.basePath == null
			|| this.state.fileObject == null
			|| this.state.fileObject.type !== 'file'
		) return null;

		const { pageNumber, numPages, fileObject, basePath, scale } = this.state;

		console.log({pageNumber, numPages})

        return (
            
            <React.Fragment>

                <div className={classes.pageSliderDiv}>
					<Slider
						value={this.state.numPages - this.state.pageNumber + 1}
						orientation="vertical"
						aria-labelledby="discrete-slider-small-steps"
						step={1}
						marks
						min={1}
						max={this.state.numPages}
						scale={(val) =>  this.state.numPages - val + 1}
						valueLabelDisplay="on"
						onChange={(e, val) => {this.setState({pageNumber: this.state.numPages - val + 1})}}
					/>			
				</div>

                <div className={classes.headerDiv}>
					Path: {fileObject.name}
					<Button onClick={() => this.setState({pageNumber: Math.max(pageNumber - 1, 0)})}>Prev</Button>				
					<Button onClick={() => this.setState({pageNumber: Math.min(pageNumber + 1, numPages)})}>Next</Button>				
				</div>				

				<div
					ref={this.viewerDiv}
					className={classes.viewerDiv}
					onMouseMove={this.handleMouseMove}
					onMouseDown={this.enableDrag}
					onMouseUp={this.disableDrag}
					onMouseLeave={this.disableDrag}
				>
					
					<Document
						file={path.join(basePath, fileObject.relPath)}
						onLoadSuccess={this.onDocumentLoadSuccess}
						onLoadError={(error) => alert('Error while loading document! ' + error.message)}
						options={{
							// Missing fonts
							disableFontFace: false
						}}
					>

						<Page
							key={`page_${pageNumber + 1}`}
							pageNumber={pageNumber}
							scale={scale}
						/>

					</Document>

					<p>Page {pageNumber} of {numPages}</p>

				</div>
			
            </React.Fragment>

        );

    }

}

export default withStyles(styles)(Viewer);