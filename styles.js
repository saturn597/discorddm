const friendList = {
  border: {
    type: 'line',
  },
  keys: true,
  style: getBasicStyle(),

  left: '80%',
  height: '99%',
  width: '20%',
};

// TODO: this should go in styles.js.
friendList.style.selected = {
  bg: 'magenta'
};

const messages = {
  border: {
    type: 'line',
  },
  content: 'Connecting...',
  style: getBasicStyle(),
  tags: true,

  height: '90%-1',
  width: '80%-1',
};

const input = {
  border: {
    type: 'line',
  },
  style: getBasicStyle(),

  top: '90%',
  height: '10%',
  width: '80%-1',
};

function getBasicStyle() {
  // Using a function to fetch a new version of the style for each widget.
  // Having a single shared object causes issues.
  return  {
    border: {
      fg: 'white',
    },
    focus: {
      border: {
        fg: 'green',
      },
    },
  }
}

module.exports = {
  friendList,
  input,
  messages,
};

