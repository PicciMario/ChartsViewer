import path from 'path'
import fs from 'fs'

/**
 * Name of the config file (stored in userData).
 */
const configFileName = 'config.json';

class GlobalConfig{

    constructor(){
		const remote = require('electron').remote;
		const app = remote.app;	        
        this._configFile = path.join(app.getPath('userData'), configFileName);
        this._retrieveFromConfig();
    }

	/**
	 * Stores the value of a config key.
	 * @param {string} key Config key to store.
	 * @param {any} value Value to store.
	 */
    set(key, value){
        this._data[key] = value;
        this._updateConfigFile();
    }

	/**
	 * Returns the value of the config key, or (if null) the 
	 * default.
	 * @param {string} key Config key to retrieve.
	 * @param {any} defaultVal Default value (not provided: null).
	 * @returns {any} Value of the config key, default if not found.
	 */
    get(key, defaultVal = null){
        return this._data[key] || defaultVal;
    }

    printAll(){
        console.log(this._data);
	}

	/**
	 * Read all the config keys from the configuration file.
	 */
    _retrieveFromConfig(){

        try{
            console.log("Lettura configurazione da " + this._configFile);
            this._data = JSON.parse(fs.readFileSync(this._configFile))
            console.log("Letta configurazione", this._data)
        }
        catch (e){
            console.error("Errore lettura file configurazione", e);
            this._data = {}
        }

    }

	/**
	 * Saves the current config dataset into the config file, overwriting it.
	 */
    _updateConfigFile(){
        
        try{
            console.log("Scrittura configurazione su " + this._configFile);
            fs.writeFileSync(this._configFile, JSON.stringify(this._data));
            console.log("Scrittura configurazione effettuata", this._data)
        }
        catch (e){
            console.error("Errore salvataggio configurazione", e);
        }        

    }

}

const instance = new GlobalConfig();

export default instance;