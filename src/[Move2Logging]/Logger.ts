export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}
const logLevel = LogLevel.Debug

export class Logger {
  static debug(msg: string, ...args: any[]) {
    if (logLevel > LogLevel.Debug) return
    console.debug(msg, ...args)
  }

  static logInfo(msg: string, ...args: any[]) {
    if (logLevel > LogLevel.Info) return
    console.info(msg, ...args)
  }

  static warn(msg: string, ...args: any[]) {
    if (logLevel > LogLevel.Warn) return
    console.warn(msg, ...args)
  }

  static error(msg: string, ...args: any[]) {
    if (logLevel > LogLevel.Error) return
    console.error(msg, ...args)
  }
}

export function debug(msg: string, ...args: any[]) {
  if (logLevel > LogLevel.Debug) return
  console.debug(msg, ...args)
}

export function logInfo(msg: string, ...args: any[]) {
  if (logLevel > LogLevel.Info) return
  console.info(msg, ...args)
}

export function warn(msg: string, ...args: any[]) {
  if (logLevel > LogLevel.Warn) return
  console.warn(msg, ...args)
}

export function error(msg: string, ...args: any[]) {
  if (logLevel > LogLevel.Error) return
  console.error(msg, ...args)
}