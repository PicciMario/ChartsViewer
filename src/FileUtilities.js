import path from 'path'
import fs from 'fs'

/**
 * Restituisce un array rappresentante il contenuto della cartella passata
 * come parametro (chiamata ricorsivamente).
 * @param {*} dirNode 
 */
export function readDirTree(basePath, dirNode = null){
	
	let parentRelPath = dirNode != null ? dirNode.relPath : null;
	let parentFullPath = path.join(basePath, parentRelPath || "")

	let content = [];

	let readFiles = [];
	
	try{
		readFiles = fs.readdirSync(parentFullPath);
	}
	catch (err){
		console.log("Errore lettura dir", parentFullPath, err);
		return [];
	}

	readFiles.forEach(dirElement => {

		let elementRelPath = path.join(parentRelPath || "", dirElement)
		let elementFullPath = path.join(basePath, elementRelPath)
		let elementExtension = path.extname(elementFullPath)

		let stats;
		try{
			stats = fs.statSync(elementFullPath);
		}
		catch (err){
			console.log("Errore lettura stats file", elementFullPath, err);
			return;
		}

		if (stats.isDirectory()){
			let newNode = {
				parentRelPath: parentRelPath,
				name: dirElement, 
				relPath: elementRelPath, 
				type: "dir"
			};			
			content.push(newNode)
			readDirTree(basePath, newNode).forEach(item => content.push(item))

		}
		else {

			// Filtra solo PDF
			if (elementExtension.toUpperCase() !== '.PDF') return;

			let newNode = {
				parentRelPath: parentRelPath,
				name: dirElement, 
				relPath: elementRelPath, 
				type: "file",
				extension: elementExtension
			};
			content.push(newNode);
		}

	})

	return content;

}		