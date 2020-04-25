import React, { Component } from 'react';
import { Document, Page, Outline } from 'react-pdf';

import fs from 'fs'
import path from 'path'

export default class Viewer extends React.Component {

    constructor(){

        super();

        let fileFolder = 'C:/Users/mario/Documents/charts-viewer/charts';
        let filePath = path.join(fileFolder, 'prova.pdf')

        this.state = {
            numPages: null,
            pageNumber: 1,
            fileFolder,
            filePath
        }
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

        render() {

            if (this.state.fileFolder == null) return null;

            const { remote } = window.require('electron')
            console.log("appData", remote.app.getPath('appData'))
            console.log("userData", remote.app.getPath('userData'))
            console.log("appPath", remote.app.getAppPath())

            fs.readdir(this.state.fileFolder, (err, dir) => {
                for (let filePath of dir) {
                    console.log(filePath);
                }
            });

            const { pageNumber, numPages } = this.state;

            return (
                
                <div>

                    <div>Path: {this.state.fileFolder}</div>

                    <div
                        onClick={() => {
                            this.setState({
                                filePath: path.join(this.state.fileFolder, 'prova2.pdf')
                            })
                        }}
                    >
                        documentazione
                    </div>                

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