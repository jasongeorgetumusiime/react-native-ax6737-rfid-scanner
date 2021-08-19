import React, {useEffect, useReducer} from 'react';
import TagsScreen from './src/screens/TagsScreen';

import scanner from 'react-native-ax6737-rfid-scanner';

const updateTagData = (tagId, tags) => {
  tags.has(tagId) ? tags.set(tagId, tags.get(tagId) + 1) : tags.set(tagId, 1);
  return tags;
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SCAN_TOGGLED':
      return {...state, isScanning: !state.isScanning};
    case 'TAG_REGISTERED':
      return {...state, tags: updateTagData(action.tagId, state.tags)};
    default:
      return state;
  }
};

const INITIAL_STATE = {tags: new Map(), isScanning: false};

const App = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const scanSingleTag = async () => {
    try {
      const result = await scanner.readSingleTag();
      console.log('SCAN SINGLE TAG', result);
      dispatch({type: 'TAG_REGISTERED', tagId: result[0]});
    } catch (e) {
      throw new Error('Could not scan single asset: ' + e.message);
    }
  };

  const scanAction = () => {
    if (state.isScanning) {
      scanner.stopReadingTags(message =>
        console.log('Stopped reading tags ==> ', message),
      );
    } else {
      scanner.startReadingTags(message =>
        console.log('Started reading tags ==> ', message),
      );
    }
    dispatch({type: 'SCAN_TOGGLED'});
  };

  useEffect(() => {
    scanner.initializeReader();

    const tagMonitor = scanner.tagListener(event => {
      console.log('TAG DATA: ', event);
      dispatch({type: 'TAG_REGISTERED', tagId: event[0]});
    });
    // Just Log the power  status.
    // Should add logic based on your application
    const powerMonitor = scanner.powerListener(event =>
      console.log('POWER STATUS: ', event),
    );

    return () => {
      tagMonitor.remove();
      powerMonitor.remove();
    };
  }, []);

  return (
    <TagsScreen
      tagData={state.tags}
      reset={scanner.clearTags}
      triggerScan={scanSingleTag}
      isScanning={state.isScanning}
      scanningAction={scanAction}
    />
  );
};
export default App;
