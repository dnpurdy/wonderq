const uuidv4 = require('uuid/v4');

class Message {
    constructor(content) {
        this.content = content;
        this.id = uuidv4();
        this._createTime = Date.now();
        this._dequeueTime = null;
    }

    set dequeueTime(dequeueTime) {
        this._dequeueTime = dequeueTime;
    }

    get dequeueTime() {
        return this._dequeueTime;
    }
}

module.exports = Message;