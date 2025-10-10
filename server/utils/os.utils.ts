import * as path from 'path'
import { homedir } from 'os'

const processRef = process

export class OsUtils {
  public static getHomeDir(): string {
    return homedir()
  }

  public static isOsWin(): boolean {
    return processRef.platform === 'win32'
  }

  public static isOsMac(): boolean {
    return processRef.platform === 'darwin'
  }

  public static isOsUnix(): boolean {
    return (
      processRef.platform === 'freebsd' ||
      processRef.platform === 'linux' ||
      processRef.platform === 'openbsd' ||
      processRef.platform === 'sunos' ||
      processRef.platform === 'aix'
    )
  }

  public static execOsCmd(
    workDir: string,
    cmd: string,
    args: string[],
    additionalSpawnOptions: Record<string, any> = {},
    stdout_callback?: (data: string) => void,
    stderr_callback?: (data: string) => void
  ): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      let usedPid: number | undefined = undefined

      const options: any = {
        ...processRef.env,
        cwd: path.resolve(path.normalize(workDir)),
        encoding: 'utf8',
        shell: true,
        detached: false,
        timeout: 60000,
        ...(additionalSpawnOptions ?? {}),
      }

      if (this.isOsUnix()) {
        options.detached = true
      }

      try {
        console.log(`spawn <${cmd}> in <${workDir}> with args: ${JSON.stringify(args)}`)
        const { spawn } = await import('node:child_process')
        const child = spawn(cmd, args, options)

        if (this.isOsUnix()) {
          child.unref()
        }

        usedPid = child.pid

        child.on('error', (error: any) => {
          reject(error)
        })

        if (stdout_callback && child.stdout) {
          child.stdout.setEncoding('utf8')
          child.stdout.on('data', (data: string) => {
            stdout_callback(data)
          })
        }

        if (stderr_callback && child.stderr) {
          child.stderr.setEncoding('utf8')
          child.stderr.on('data', (data: string) => {
            stderr_callback(data)
          })
        }

        child.on('exit', (code: number) => {
          console.log(`child_process <${cmd}> exit: ${code}`)
          switch (code) {
            case 0:
              resolve(code)
              break
            default:
              reject(code)
              break
          }
        })

        const exitCode = (child as any).exitCode
        if (exitCode !== undefined && exitCode !== null) {
          switch (exitCode) {
            case 0:
              resolve(exitCode)
              break
            default:
              reject(exitCode)
              break
          }
        }
      } catch (e) {
        reject(e)
      }
    })
  }
}
