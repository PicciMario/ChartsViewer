import React from 'react';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf';

export default class Viewer extends React.Component {

	static propTypes = {
		filePath: PropTypes.string.isRequired
	};

	static defaultPropTypes = {
		filePath: null
	}

    constructor(props){

        super(props);

        this.state = {
            numPages: null,
            pageNumber: 1,
            filePath: props.filePath
		}
		
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    render() {

        const { pageNumber, numPages } = this.state;

        return (
            
            <div>

                <div>Path: {this.state.filePath}</div>

                <Document
                    file={this.state.filePath}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                    onLoadError={(error) => alert('Error while loading document! ' + error.message)}
                    options={{
                        // Gestione font mancanti
                        disableFontFace: false
                    }}
                >

                {
                    Array.from(
                        new Array(numPages),
                            (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                />
                            ),
                    )
                }

                </Document>

                <p>Page {pageNumber} of {numPages}</p>

            </div>
        );

    }

}