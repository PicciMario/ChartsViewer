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
	
	componentWillReceiveProps(nextProps){
		if (nextProps.filePath !== this.state.filePath){
			this.setState({
				filePath: nextProps.filePath,
				pageNumber: 1
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

				<div onClick={() => this.setState({pageNumber: this.state.pageNumber + 1})}>Next</div>

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
					/>

                </Document>

                <p>Page {pageNumber} of {numPages}</p>

            </div>
        );

    }

}