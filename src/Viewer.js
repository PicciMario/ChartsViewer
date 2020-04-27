import React from 'react';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf';
import { Button } from '@material-ui/core';
import path from 'path';

export default class Viewer extends React.Component {

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

	enableDrag = () => {
		this.setState({dragging: true});
	}

	disableDrag = () => {
		this.setState({dragging: false});
	}

    render() {

		console.log("render", this.state)

		if (
			this.state.basePath == null
			|| this.state.fileObject == null
			|| this.state.fileObject.type !== 'file'
		) return null;

		const { pageNumber, numPages } = this.state;
		
		const headerHeight = 50;

        return (
            
            <React.Fragment>

                <div
					style={{
						position: "absolute",
						top: 0,
						height: headerHeight,
						left: 0,
						right: 0
					}}
				>
					Path: {this.state.fileObject.name}
					<Button onClick={() => this.setState({pageNumber: Math.max(this.state.pageNumber - 1, 0)})}>Prev</Button>				
					<Button onClick={() => this.setState({pageNumber: Math.min(this.state.pageNumber + 1, this.state.numPages)})}>Next</Button>				
				</div>

				<div
					ref={this.viewerDiv}
					style={{
						position: "absolute",
						top: headerHeight,
						bottom: 0,
						left: 0,
						right: 0,
						overflowX: "auto",
						overflowY: "auto",
						display:'flex',
						flexDirection: "column",
					}}

					onMouseMove={this.handleMouseMove}
					onMouseDown={e => {
						// impedisce la selezione accidentale di testo nel pdf
						e.preventDefault();
						this.enableDrag();
					}}
					onMouseUp={this.disableDrag}
					onMouseLeave={this.disableDrag}
				>

				<div style={{
					alignSelf: "normal"
				}}>

					<Document
						file={path.join(this.state.basePath, this.state.fileObject.relPath)}
						onLoadSuccess={this.onDocumentLoadSuccess}
						onLoadError={(error) => alert('Error while loading document! ' + error.message)}
						options={{
							// Gestione font mancanti
							disableFontFace: false
						}}
					>

						<Page
							key={`page_${this.state.pageNumber + 1}`}
							pageNumber={this.state.pageNumber}
							scale={this.state.scale}
						/>

					</Document>

					<p>Page {pageNumber} of {numPages}</p>

				</div>

				</div>
			
            </React.Fragment>

        );

    }

}