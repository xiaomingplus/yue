import Logger from './logger';
let log = Logger.get('yue');
log.setLevel('debug');
export function warn(...args){
    log.warn(...args);
}
export function debug(...args){
    log.debug(...args);
}
export function error(...args){
    log.error(...args);
}