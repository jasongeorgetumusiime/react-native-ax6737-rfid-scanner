import React, {useEffect, useReducer} from 'react';
import TagsScreen from './src/screens/TagsScreen';

import Scanner from 'react-native-ax6737-rfid-scanner';

const updateTagData = (tagId, tags) => {
  tags.has(tagId) ? tags.set(tagId, tags.get(tagId) + 1) : tags.set(tagId, 1);
  return tags;
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TAG_REGISTERED':
      return {...state, tags: updateTagData(action.tagId, state.tags)};
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, {tags: new Map()});
  const {powerListener, tagListener, readSingleTag, clearTags} = Scanner;

  const scanSingleTag = async () => {
    try {
      const result = await readSingleTag();
      console.log('SCAN SINGLE TAG', result);
      dispatch({type: 'TAG_REGISTERED', tagId: result[0]});
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const tagMonitor = tagListener(event => {
      console.log('TAG DATA: ', event);
      dispatch({type: 'TAG_REGISTERED', tagId: event[0]});
    });
    // Just Log the power  status.
    // Should add logic based on your application
    const powerMonitor = powerListener(event =>
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
      reset={clearTags}
      triggerScan={scanSingleTag}
    />
  );
};
export default App;
