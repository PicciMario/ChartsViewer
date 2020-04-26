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

        return (
            
            <div>

                <div>Path: {this.state.filePath}</div>

				<Button onClick={() => this.setState({pageNumber: this.state.pageNumber + 1})}>Next</Button>
				<Button onClick={() => this.setState({scale: this.state.scale + 0.1})}>Zoom+</Button>


                <Document
                    file={this.state.filePath}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                    onLoadError={(error) => alert('Error while loading document! ' + error.message)}
                    options={{
                        // Gestione font mancanti
                        disableFontFace: false
                    }}
                >
					<div style={{
						overflow: 'scroll',
						width: "100%"
					}}>
					<Page
						key={`page_${this.state.pageNumber + 1}`}
						pageNumber={this.state.pageNumber}
						scale={this.state.scale}
					/>
					</div>

                </Document>

                <p>Page {pageNumber} of {numPages}</p>

            </div>
        );

    }

}