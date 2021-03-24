import { NativeEventEmitter, NativeModules } from 'react-native';

const { Ax6737RfidScanner } = NativeModules;

const eventEmitter = new NativeEventEmitter(Ax6737RfidScanner);

export const powerListener = (listener: any) =>
  eventEmitter.addListener('UHF_POWER', listener);

export const tagListener = (listener: any) =>
  eventEmitter.addListener('UHF_TAG', listener);

export const clearTags = () => Ax6737RfidScanner.clearTags();

export default {  testModule: Ax6737RfidScanner.ping };
