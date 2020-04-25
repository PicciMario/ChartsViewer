import React from 'react';
import './App.css';
import Viewer from './Viewer';

// Modifiche per funzionamento worker react-pdf
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `http://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  return (
    <div className="App">
      <h1>Ciao</h1>
      <Viewer/>
    </div>
  );
}

export default App;
