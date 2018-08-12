const friendList = {
  border: {
    type: 'line',
  },
  keys: true,
  style: getBasicStyle(),
  tags: true,

  left: '80%',
  height: '99%',
  width: '20%',
};

friendList.style.selected = {
  bg: 'magenta'
};

const messages = {
  alwaysScroll: true,
  border: {
    type: 'line',
  },
  content: 'Connecting...',
  scrollable: true,
  scrollbar: true,
  style: getBasicStyle(),
  tags: true,

  height: '90%-1',
  width: '80%-1',
};

messages.style.scrollbar = {
  bg: 'blue',
}

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

