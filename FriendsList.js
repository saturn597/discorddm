const blessed = require('blessed');

class FriendsList extends blessed.List {
  constructor(onSwitch, ...args) {
    super(...args);
    this.friends = new Map();
    this.highlighted = new Set();
    // onSwitch is a function called whenever the user switches friends. It'll
    // be called with one argument, the friend switched to.
    this.onSwitch = onSwitch;

    this.on('select', e => {
      const friendSelected = this.friends.get(blessed.stripTags(e.content));
      onSwitch(friendSelected);
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

module.exports = FriendsList;
