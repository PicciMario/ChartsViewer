import path from 'path'
import fs from 'fs'

class GlobalConfig{

    constructor(){

		const remote = require('electron').remote;
		const app = remote.app;	        
        this._configFile = path.join(app.getPath('userData'), 'config.json');
        this.retrieveFromConfig();

    }

    set(key, value){
        this._data[key] = value;
        this.updateConfigFile();
    }

    get(key){
        return this._data[key];
    }

    printAll(){
        console.log(this._data);
    }

    retrieveFromConfig(){

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

    updateConfigFile(){
        
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