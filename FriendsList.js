const blessed = require('blessed');

class FriendsList extends blessed.List {
  constructor(onSwitch, ...args) {
    super(...args);
    this.friends = new Map();
    // onSwitch is a function called whenever the user switches friends. It'll
    // be called with one argument, the friend switched to.
    this.onSwitch = onSwitch;

    this.on('select', e => {
      const friendSelected = this.friends.get(blessed.stripTags(e.content));
      onSwitch(friendSelected);
    });
  }

  setFriends(friends) {
    friends.forEach(friend => {
      const name = `${friend.username}#${friend.discriminator}`;
      this.friends.set(name, friend);
    });
    this.setItems(Array.from(this.friends.keys()));
  }
}

module.exports = FriendsList;
