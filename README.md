# react-native-ax6737-rfid-scanner

## Getting started

`$ npm install react-native-ax6737-rfid-scanner --save`

### Mostly automatic installation

`$ react-native link react-native-ax6737-rfid-scanner`

## Usage

A simple Example application can be found in the [AX6737RfidScannerExample](https://github.com/jasongeorgetumusiime/react-native-ax6737-rfid-scanner/tree/main/AX6737RfidScannerExample) code.

Since it is React Native code you can feel free to use your own preferred best practices to utilize the library API.

## API Documentation

`tagListener` - Registers a listener for a detected RFID tags `event`s. An `event` is an array whose first element, `event[0]` is the FRID Tag ID.

```javascript
import { tagListener } from 'react-native-ax6737-rfid-scanner';

// See https://github.com/jasongeorgetumusiime/react-native-ax6737-rfid-scanner/tree/main/AX6737RfidScannerExample
...
  useEffect(() => {
    const tagMonitor = tagListener(event => console.log(`DETECTED TAG WITH ID: ${event[0]}`));
    return () => tagMonitor.remove();
  }, []);
...
```

`powerListener` - Registers a listener to detect whether the device is powered on/off.

```javascript
import { powerListener } from 'react-native-ax6737-rfid-scanner';

// See https://github.com/jasongeorgetumusiime/react-native-ax6737-rfid-scanner/tree/main/AX6737RfidScannerExample
...
  useEffect(() => {
    // Should add logic on what to do based on your application
    const powerMonitor = powerListener(event => console.log('POWER STATUS: ', event));
    return () => powerMonitor.remove();
  }, []);
...
```

`clearTags` - [WIP].
