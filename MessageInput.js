const blessed = require('blessed');

class MessageInput extends blessed.Textarea {
  constructor(callback, ...args) {
    super(...args);

    this.callback = callback;

    this._listener = this._listener.bind(this);

    this.on('keypress', this._listener);

    this.on('focus', () => this.screen.grabKeys = true);
    this.on('blur', () => this.screen.grabKeys = false);
  }

  _listener(ch, key) {
    if (key.name === 'tab') {
      // Don't add tabs to the message since we use that to change focus
      return true;
    } else if (key.name === 'enter') {
      if (this.value.length === 0) {
        return true;
      }
      this.callback(this.value);
      this.value = '';
      return true;
    }
    return super._listener(ch, key);
  }
}

module.exports = MessageInput;
