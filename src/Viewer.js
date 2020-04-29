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
		top: headerHeight,
		bottom: 30,
		display: 'flex',
		flexDirection: 'column',
	},

	pageSliderValueLabel: {
		left: 'calc(-50% + 20px)',
		top: 'calc(-50% - 8px)',
		'& *': {
			background: 'transparent',
			color: '#000',
			fontSize: 12
		},		
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
			dragging: false,
			numPages: 0
		}

		this.viewerDiv = React.createRef();
		this.sliderDiv = React.createRef();

		/*
		Set to true whenever I set a new fileobject in the store, and put
		to false after the first page render. Used to to run operations after
		the first page render, such as managing the initial scroll position.
		*/
		this.justLoaded = false;
		
	}

	componentDidMount() {

		// NB: il listener sulla rotella del mouse deve essere creato alla vecchia maniera
		// sul DOM per poter utilizzare l'opzione passive a false. Questa è resa necessaria 
		// da un recente update di Chrome che considera i movimenti della rotella come passivi, 
		// e impedisce il preventDefault a livello di documento.
		if (this.viewerDiv.current) {
			this.viewerDiv.current.addEventListener('mousewheel', this.handleWheel, { passive: false});
		}
		if (this.sliderDiv.current){
			this.sliderDiv.current.addEventListener('mousewheel', this.handleSliderWheel, {passive: false});
		}

		// This runs when the first document is selected after opening the app.
		this.justLoaded = true;
		this.setState({
			fileObject: this.props.fileObject,
			pageNumber: this.props.fileObject.page || 1,
			scale: this.props.fileObject.scale || 1.0,	
		})

	}

	componentWillUnmount() {
		if (this.viewerDiv.current) {
			this.viewerDiv.current.removeEventListener('mousewheel', this.handleWheel);
		}
		if (this.sliderDiv.current) {
			this.sliderDiv.current.removeEventListener('mousewheel', this.handleSliderWheel);
		}		
	}	

	
	componentDidUpdate(prevProps, prevState, snapshot){

		// This runs when you select a new file on the tree, anytime BUT the
		// first one (that is taken care of in componentDidMount).
		if (this.props.fileObject !== this.state.fileObject){

			this.justLoaded = true;

			this.setState({
				fileObject: this.props.fileObject,
				pageNumber: this.props.fileObject.page || 1,
				scale: this.props.fileObject.scale || 1.0,
			})

		}

	}

	/**
	 * Callback when a PDF has been loaded.
	 */
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ 
			numPages
		});
	}

	/**
	 * Callback when a page has been rendered on screen.
	 */
	handlePageRenderSuccess = (() => {

		if (this.justLoaded){
			this.justLoaded = false;
			let {scrollX, scrollY} = this.state.fileObject;
			if (scrollX != null || scrollY != null){

				let div = this.viewerDiv.current;
				if (div == null) return;	
				div.scrollTo(
					scrollX || 0,
					scrollY || 0
				)	
			}
		}

	})
	
	/**
	 * Callback mousewheel when inside viewer div.
	 * Takes care of the documents's scale.
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
	 * Callback mousewheel on page slider.
	 * Navigates through the pages.
	 */
	handleSliderWheel = (e) => {
		
		e.preventDefault();

		let wheelDir = e.deltaY;
		let {pageNumber, numPages} = this.state;

		if (wheelDir > 0){
			this.setState({pageNumber: Math.min(pageNumber + 1, numPages)})
		}
		else {
			this.setState({pageNumber: Math.max(pageNumber - 1, 1)})
		}

	}	

	/**
	 * Callback when mouse moved inside viewer div.
	 * Takes care of document dragging (when dragging enabled).
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

		const { pageNumber, numPages, fileObject, scale } = this.state;
		const { basePath } = this.props;

		let div = this.viewerDiv.current;
		let scrollX = 0, scrollY = 0;
		if (div != null){
			scrollX = div.scrollLeft;
			scrollY = div.scrollTop;
		}

        return (
            
            <React.Fragment>

                <div className={classes.pageSliderDiv} ref={this.sliderDiv}>
				
					{/* Actual page number. */}
					<span style={{alignSelf: 'center', marginBottom: 10}}>{this.state.pageNumber}</span>

					<Slider
						value={this.state.numPages - this.state.pageNumber + 1}
						orientation="vertical"
						aria-labelledby="discrete-slider-small-steps"
						step={1}
						marks={this.state.numPages && this.state.numPages < 500}
						min={1}
						max={this.state.numPages}
						scale={(val) =>  this.state.numPages - val + 1}
						valueLabelDisplay="auto"
						onChange={(e, val) => {this.setState({pageNumber: this.state.numPages - val + 1})}}
						classes={{
							valueLabel: classes.pageSliderValueLabel
						}}
					/>			

					{/* Total number of pages. */}
					<span style={{alignSelf: 'center', marginTop: 10}}>{this.state.numPages}</span>

				</div>

				<div className={classes.headerDiv}>
					Scale: {this.state.scale}, Scroll: {scrollX}:{scrollY}
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

					{

						/*
						The div which contains this has to be renderer everytime, because
						it is the one to which we attach mousewheel event handlers upon
						mounting the component. Otherwise we lose the events.
						Leaving this here because I just wasted like half an hour chasing
						down my disappearing events.
						*/

						this.props.basePath != null
						&& this.state.fileObject != null
						&& this.state.fileObject.type === 'file'					
						&&
						
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
								onRenderSuccess={this.handlePageRenderSuccess}
							/>

						</Document>

					}

					<p>Page {pageNumber} of {numPages}</p>


				</div>
			
            </React.Fragment>

        );

    }

}

export default withStyles(styles)(Viewer);