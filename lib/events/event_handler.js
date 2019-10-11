const uuidv4 = require('uuid/v4');
const socket = require('../prosocket');
const { getSignature } = require('../signature');

const eventNames = {
  powerState: 'setPowerState',
  setBrightness: 'setBrightness',
  powerLevel: 'setPowerLevel',
  color: 'setColor',
  colorTemperature: 'setColorTemperature',
};

const actionArr = ['setPowerState', 'setBrightness', 'setPowerLevel', 'setColor', 'setColorTemperature'];

const getJson = (eventName, deviceId, value) => {
  const header = {
    payloadVersion: 2,
    signatureVersion: 1,
  };
  const payload = {
    action: eventName,
    cause: {
      type: 'PHYSICAL_INTERACTION',
    },
    createdAt: Math.round(new Date() / 1000),
    deviceId,
    replyToken: uuidv4(),
    type: 'event',
    value,
  };
  const signature = {
    HMAC: getSignature(JSON.stringify(payload)),
  };

  return ({ header, payload, signature });
};


const raiseEvent = (eventName, deviceId, value) => {
  if (actionArr.includes(eventName)) {
    console.log(eventName);
    socket.send(JSON.stringify(getJson(eventName, deviceId, value)));
  } else {
    console.log('Invalid Event');
  }
};

module.exports = { raiseEvent, eventNames };