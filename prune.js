'use strict'

const child = require('child_process')
const debug = require('debug')('electron-packager')

const knownPackageManagers = ['npm', 'cnpm', 'yarn']

function pruneCommand(packageManager) {
  switch (packageManager) {
    case 'npm':
    case 'cnpm':
      return `${packageManager} prune --production && ${packageManager} rebuild`
    case 'yarn':
      return `${packageManager} install --production`
  }
}

function pruneModules(opts, appPath, cb) {
  const packageManager = opts.packageManager || 'npm'

  if (packageManager === 'cnpm' && process.platform === 'win32') {
    return cb(new Error('cnpm support does not currently work with Windows, see: https://github.com/electron-userland/electron-packager/issues/515#issuecomment-297604044'))
  }

  const command = pruneCommand(packageManager)

  if (command) {
    debug(`Pruning modules via: ${command}`)
    child.exec(command, { cwd: appPath, env: { "WCJS_ARCH": opts.arch, "WCJS_PLATFORM": opts.platform } }, (e, out, err) => {
      console.log(e, out, err);
      return cb(e,out,err);
    })
  } else {
    cb(new Error(`Unknown package manager "${packageManager}". Known package managers: ${knownPackageManagers.join(', ')}`))
  }
}

module.exports = {
  pruneCommand: pruneCommand,
  pruneModules: pruneModules
}
