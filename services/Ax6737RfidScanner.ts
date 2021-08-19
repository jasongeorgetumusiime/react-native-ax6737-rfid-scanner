import { NativeEventEmitter, NativeModules } from 'react-native';

const { Ax6737RfidScanner } = NativeModules;

const eventEmitter = new NativeEventEmitter(Ax6737RfidScanner);

const powerListener = (listener: any) =>
  eventEmitter.addListener('UHF_POWER', listener);

const tagListener = (listener: any) =>
  eventEmitter.addListener('UHF_TAG', listener);

export default {
  powerListener,
  tagListener,
  clearTags: Ax6737RfidScanner.clearTags,
  readSingleTag: Ax6737RfidScanner.readSingleTag,
  initializeReader: Ax6737RfidScanner.initializeDevice,
  startReadingTags: Ax6737RfidScanner.startReadingTags,
  stopReadingTags: Ax6737RfidScanner.stopReadingTags,
 };