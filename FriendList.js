const blessed = require('blessed');

class FriendList extends blessed.List {
  constructor(...args) {
    super(...args);
    this.friends = new Map();
    this.highlighted = new Set();

    this.on('select item', e => {
      // blessed.List emits a "select item" event after a new list item is
      // selected. But we want events that send the friend object to the
      // receiver, rather than just sending the blessed "element." So,
      // emitting a special friendSelect event.
      const friendSelected = this.friends.get(blessed.stripTags(e.content));
      this.emit('friendSelect', friendSelected);
    });
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
