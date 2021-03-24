import React, {useEffect, useReducer} from 'react';
import TagsScreen from './src/screens/TagsScreen';

import {powerListener, tagListener} from 'react-native-ax6737-rfid-scanner';

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

  useEffect(() => {
    const tagMonitor = tagListener(event =>
      dispatch({type: 'TAG_REGISTERED', tagId: event[0]}),
    );
    // Just Log the power  status.
    // Should add better logic based on your application
    const powerMonitor = powerListener(event =>
      console.log('POWER STATUS: ', event),
    );

    return () => {
      tagMonitor.remove();
      powerMonitor.remove();
    };
  }, []);

  return <TagsScreen tagData={state.tags} />;
};
export default App;
