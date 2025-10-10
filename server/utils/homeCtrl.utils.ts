import * as path from 'path'
import { OsUtils } from './os.utils'

export class HomeCtrlUtils {
  private static HOME_ENV = {
    workDir: (process.env.NUXT_HOMECTRL_WORKDIR || (OsUtils.getHomeDir() + '/homeCtrl')),
    scriptNameLocalDNSResolve: 'dnsEntryProvider.sh',

    scriptNameNasWolExec: 'nasWol.sh',
    scriptNameNasPing: 'nasPing.sh',
    scriptNameNasShutdown: 'nasShutdown.sh',
    scriptNameNasShutdownCancel: 'nasShutdownCancel.sh',
    scriptNameNasShutdownInfo: 'nasShutdownInfo.sh',
    scriptNameReadUpdateStateNas: 'nasUpdateState.sh',

    scriptNameDevWolExec: 'devWol.sh',
    scriptNameDevPing: 'devPing.sh',
    scriptNameDevShutdown: 'devShutdown.sh',
    scriptNameDevShutdownCancel: 'devShutdownCancel.sh',
    scriptNameDevShutdownInfo: 'devShutdownInfo.sh',
    scriptNameReadUpdateStateDev: 'devUpdateState.sh',
    scriptNameReadServicesDev: 'devServices.sh',
  }

  private static async execPredefinedShell(cmdName: string): Promise<string[]> {
    if (!cmdName || cmdName.length <= 0) {
      return []
    }

    const workDir: string = HomeCtrlUtils.HOME_ENV.workDir
    let result = -1
    let scriptStdOut: string | undefined = undefined
    let scriptStdErr: string | undefined = undefined
    try {
      result = await OsUtils.execOsCmd(
        workDir,
        path.join(workDir, cmdName),
        [],
        {},
        (stdout) => {
          scriptStdOut = stdout
        },
        (stderr) => {
          scriptStdErr = stderr
        }
      )
    } catch (e) {
      console.error('execPredefinedShell ERROR: ', e)
    }

    if (result === 0) {
      if (scriptStdOut) {
        return (<string>scriptStdOut).split('\n');
      } else {
        return []
      }
    }

    return ['Failed', 'code: ' + result]
  }

  public static async getLocalDNSEntries(): Promise<string[]> {
    return this.execPredefinedShell(HomeCtrlUtils.HOME_ENV.scriptNameLocalDNSResolve)
  }

  public static async execNasWol(): Promise<string> {
    const workDir: string = HomeCtrlUtils.HOME_ENV.workDir
    try {
      const resultCode: number = await OsUtils.execOsCmd(
        workDir,
        path.join(workDir, HomeCtrlUtils.HOME_ENV.scriptNameNasWolExec),
        []
      )
      if (resultCode === 0) {
        return 'OK'
      }
    } catch (e) {
      console.error('execNasWol ERROR: ', e)
    }
    return 'Failed'
  }

  public static async pingNas(): Promise<string[]> {
    const workDir: string = HomeCtrlUtils.HOME_ENV.workDir
    let pingResult: number = -1
    let pingStdOut: string | undefined = undefined
    try {
      pingResult = await OsUtils.execOsCmd(
        workDir,
        path.join(workDir, HomeCtrlUtils.HOME_ENV.scriptNameNasPing),
        [],
        {},
        (stdout) => {
          pingStdOut = stdout
        }
      )
    } catch (e) {
      console.error('pingNas ERROR: ', e)
    }

    if (pingResult === 0) {
      const regExpPingWError = /icmp_seq=[0-9] (.*) --- .* --- ([0-9]* packets transmitted), ([0-9]* received), \+([0-9]* errors), ([0-9]*\% packet loss), (time [0-9]*ms)/
      const regExpPing = /icmp_seq=[0-9] (.*) --- .* --- ([0-9]* packets transmitted), ([0-9]* received), ([0-9]*\% packet loss), (time [0-9]*ms)/
      const regExpPingNoIcmp = /([0-9]* packets transmitted), ([0-9]* received), ([0-9]*\% packet loss), (time [0-9]*ms)/
      const stdOutStr: string = JSON.stringify(pingStdOut)

      let matchEntries = -1
      let match: RegExpMatchArray | null | undefined = undefined
      if (stdOutStr.indexOf('errors') > -1) {
        matchEntries = 6
        match = stdOutStr.match(regExpPingWError)
      } else if (stdOutStr.indexOf('icmp_seq=') <= -1) {
        matchEntries = 5
        match = stdOutStr.match(regExpPingNoIcmp)
      } else {
        matchEntries = 5
        match = stdOutStr.match(regExpPing)
      }

      if (match && match.length >= matchEntries) {
        const ret: string[] = []
        for (let counter = 1; counter < matchEntries; counter++) {
          ret.push(match[counter])
        }
        return ret
      } else {
        return [pingStdOut as any]
      }
    } else {
      return ['Failed', 'code: ' + pingResult]
    }
  }

  public static async getUpdateStateNas(): Promise<string[]> {
    return HomeCtrlUtils.execPredefinedShell(HomeCtrlUtils.HOME_ENV.scriptNameReadUpdateStateNas)
  }

  public static async scheduleShutdownOfNas(): Promise<string[]> {
    return HomeCtrlUtils.execPredefinedShell(HomeCtrlUtils.HOME_ENV.scriptNameNasShutdown)
  }

  public static async cancelShutdownOfNas(): Promise<string[]> {
    return HomeCtrlUtils.execPredefinedShell(HomeCtrlUtils.HOME_ENV.scriptNameNasShutdownCancel)
  }

  public static async infoShutdownOfNas(): Promise<string[]> {
    return HomeCtrlUtils.execPredefinedShell(HomeCtrlUtils.HOME_ENV.scriptNameNasShutdownInfo)
  }

  public static async execDevWol(): Promise<string> {
    const workDir: string = HomeCtrlUtils.HOME_ENV.workDir
    try {
      const resultCode: number = await OsUtils.execOsCmd(
        workDir,
        path.join(workDir, HomeCtrlUtils.HOME_ENV.scriptNameDevWolExec),
        []
      )
      if (resultCode === 0) {
        return 'OK'
      }
    } catch (e) {
      console.error('execDevWol ERROR: ', e)
    }
    return 'Failed'
  }

  public static async pingDev(): Promise<string[]> {
    const workDir: string = HomeCtrlUtils.HOME_ENV.workDir
    let pingResult: number = -1
    let pingStdOut: string | undefined = undefined
    try {
      pingResult = await OsUtils.execOsCmd(
        workDir,
        path.join(workDir, HomeCtrlUtils.HOME_ENV.scriptNameDevPing),
        [],
        {},
        (stdout) => {
          pingStdOut = stdout
        }
      )
    } catch (e) {
      console.error('pingDev ERROR: ', e)
    }

    if (pingResult === 0) {
      const regExpPingWError = /icmp_seq=[0-9] (.*) --- .* --- ([0-9]* packets transmitted), ([0-9]* received), \+([0-9]* errors), ([0-9]*\% packet loss), (time [0-9]*ms)/
      const regExpPing = /icmp_seq=[0-9] (.*) --- .* --- ([0-9]* packets transmitted), ([0-9]* received), ([0-9]*\% packet loss), (time [0-9]*ms)/
      const regExpPingNoIcmp = /([0-9]* packets transmitted), ([0-9]* received), ([0-9]*\% packet loss), (time [0-9]*ms)/
      const stdOutStr: string = JSON.stringify(pingStdOut)

      let matchEntries = -1
      let match: RegExpMatchArray | null | undefined = undefined
      if (stdOutStr.indexOf('errors') > -1) {
        matchEntries = 6
        match = stdOutStr.match(regExpPingWError)
      } else if (stdOutStr.indexOf('icmp_seq=') <= -1) {
        matchEntries = 5
        match = stdOutStr.match(regExpPingNoIcmp)
      } else {
        matchEntries = 5
        match = stdOutStr.match(regExpPing)
      }

      if (match && match.length >= matchEntries) {
        const ret: string[] = []
        for (let counter = 1; counter < matchEntries; counter++) {
          ret.push(match[counter])
        }
        return ret
      } else {
        return [pingStdOut as any]
      }
    } else {
      return ['Failed', 'code: ' + pingResult]
    }
  }

  public static async getUpdateStateDev(): Promise<string[]> {
    return HomeCtrlUtils.execPredefinedShell(HomeCtrlUtils.HOME_ENV.scriptNameReadUpdateStateDev)
  }

  public static async getServicesDev(): Promise<string[]> {
    return HomeCtrlUtils.execPredefinedShell(HomeCtrlUtils.HOME_ENV.scriptNameReadServicesDev)
  }

  public static async scheduleShutdownOfDev(): Promise<string[]> {
    return HomeCtrlUtils.execPredefinedShell(HomeCtrlUtils.HOME_ENV.scriptNameDevShutdown)
  }

  public static async cancelShutdownOfDev(): Promise<string[]> {
    return HomeCtrlUtils.execPredefinedShell(HomeCtrlUtils.HOME_ENV.scriptNameDevShutdownCancel)
  }

  public static async infoShutdownOfDev(): Promise<string[]> {
    return HomeCtrlUtils.execPredefinedShell(HomeCtrlUtils.HOME_ENV.scriptNameDevShutdownInfo)
  }
}
