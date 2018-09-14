const blessed = require('blessed');

class FriendList extends blessed.List {
  constructor(...args) {
    super(...args);
    this.friends = new Map();
    this.highlighted = new Set();

    // blessed.List emits a "select" event but it only fires when the user
    // completes a the selection (i.e., when pressing return when keys are
    // enabled). We want an event to fire every time the user switches between
    // friends, for more responsiveness. Also, "select" only sends the element
    // that was selected, rather than the friend object we want. Using a
    // custom "friendSelect" event for this.
    this.on('keypress', function(ch, key) {
      if (key.name === 'up') {
        this.up();
        this.screen.render();
        this.emit('friendSelect', this.getCurrentSelection());
        return;
      }
      if (key.name === 'down') {
        this.down();
        this.screen.render();
        this.emit('friendSelect', this.getCurrentSelection());
        return;
      }
    });
  }

  friendSelect(index) {
    this.select(index);
    this.emit('friendSelect', this.getCurrentSelection());
  }

  getCurrentSelection() {
    const name = blessed.stripTags(this.items[this.selected].content);
    return this.friends.get(name);
  }


  highlight(friend, state=true) {
    if (state) {
      this.highlighted.add(friend);
    } else {
      this.highlighted.delete(friend);
    }

    // TODO: might be able to reset only one friend rather than all
    this.setFriendStrings();
  }

  highlightString(s) {
    return '{red-fg}' + s + '{/}';
  }

  setFriends(friends) {
    friends.forEach(friend => {
      const name = `${friend.username}#${friend.discriminator}`;
      this.friends.set(name, friend);
    });
    this.setFriendStrings();
  }

  setFriendStrings() {
    const items = Array.from(this.friends).map(([name, friend]) => {
      return this.highlighted.has(friend) ?
          this.highlightString(name) :
          name;
    });

    this.setItems(items);
  }
}

module.exports = FriendList;
