import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

export const REFRESH_MEDICATION_LIST = 'REFRESH_MEDICATION_LIST';

export default eventEmitter; 