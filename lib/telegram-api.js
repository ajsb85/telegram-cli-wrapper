var TelegramCliWrapper = require('./telegram-cli-wrapper.js');

var APIConnection = require('./models/APIConnection.js');

var TelegramAPI = function(){
    this.socket = null;
    this.connection = null;
    this.tgcli = new TelegramCliWrapper;
}

TelegramAPI.prototype.connect = function(callback) {
    console.log('TelegramAPI::starting');
    if(this.tgcli.isRunning()){
        throw new Error('TelegramAPI is already running');
    }

    //Start telegram cli and connect to it using a socket
    this.tgcli.start(function(socket){
        this.connection = new APIConnection(socket);
        this.socket = socket;

        //Make this the main session, so message come here
        this.socket.writeLine('main_session');

        //Get contactlist for username -> id mapping
        this.socket.writeLine('contact_list');

        callback(this.connection);
    }.bind(this));
};

module.exports = TelegramAPI;
