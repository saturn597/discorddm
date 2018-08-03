const blessed = require('blessed');

class FriendsList extends blessed.List {
  constructor(onSwitch, ...args) {
    super(...args);
    this.friends = [];
    // onSwitch is a function called whenever the user switches friends. It'll
    // be called with one argument, the friend switched to.
    this.onSwitch = onSwitch;

    this.on('select', e => {
      const friendSelected = this.friends.find(
          u => `${u.username}#${u.discriminator}` === e.content);
      onSwitch(friendSelected);
    });
  }

  setFriends(friends) {
    this.friends = friends;
    this.setItems(friends.map(f => `${f.username}#${f.discriminator}`));
  }
}

module.exports = FriendsList;
