import React from 'react';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf';
import { Button } from '@material-ui/core';

export default class Viewer extends React.Component {

	static propTypes = {
		filePath: PropTypes.string
	};

	static defaultPropTypes = {
		filePath: null
	}

    constructor(props){

        super(props);

        this.state = {
            numPages: null,
			pageNumber: 1,
			scale: 1.0,
            filePath: props.filePath
		}

		this.viewerDiv = null;
		
	}
	
	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.filePath !== this.state.filePath){
			this.setState({
				filePath: this.props.filePath,
				pageNumber: 1,
				scale: 1.0
			})
		}
	}

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ 
			numPages,
			pageNumber: 1
		});
    }

    render() {

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
					Path: {this.state.filePath}
					<Button onClick={() => this.setState({pageNumber: this.state.pageNumber + 1})}>Next</Button>
					<Button onClick={() => this.setState({scale: this.state.scale + 0.1})}>Zoom+</Button>					
				</div>

				<div
					ref={ref => this.viewerDiv = ref}
					style={{
						position: "absolute",
						top: headerHeight,
						bottom: 0,
						left: 0,
						right: 0,
						overflowX: "auto",
						overflowY: "auto"
					}}
					onMouseMove={e => {

						let div = this.viewerDiv;
						if (div == null) return;
						div.scrollTo(
							div.scrollLeft + e.movementX,
							div.scrollTop + e.movementY
						)

					}}
				>

                <Document
                    file={this.state.filePath}
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

            </React.Fragment>
        );

    }

}