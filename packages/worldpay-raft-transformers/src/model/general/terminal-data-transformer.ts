import {
  BooleanString,
  EntryMode,
  POSConditionCode,
  POSEnvironment,
  TerminalEntryCap,
  TerminalType,
} from '@gradientedge/worldpay-raft-messages'

export interface TerminalDataParams {
  EntryMode?: EntryMode
  TerminalType?: TerminalType
  TerminalNumber?: string
  POSConditionCode?: POSConditionCode
  POSEnvironment?: POSEnvironment
  TerminalEntryCap?: TerminalEntryCap
  AttendedDevice?: BooleanString
  OperatingEnvironment?: string
}

export function withTerminalData(options: TerminalDataParams) {
  return {
    TerminalData: {
      ...options,
    },
  }
}
