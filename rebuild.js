'use strict'

const child = require('child_process')
const debug = require('debug')('electron-packager')

const knownPackageManagers = ['npm', 'cnpm', 'yarn']

function rebuildCommand(packageManager) {
  return `${packageManager} rebuild`
}

function rebuildModules(opts, appPath, cb) {
  const packageManager = opts.packageManager || 'npm'

  if (packageManager === 'yarn') {
    return cb(new Error('Yarn do not have command rebuild'))
  }

  const command = rebuildCommand(packageManager)

  if (command) {
    debug(`Rebuild modules: ${command}`)
    
    child.exec(command, { cwd: appPath, env: opts.env }, cb)
  } else {
    cb(new Error(`Unknown package manager "${packageManager}". Known package managers: ${knownPackageManagers.join(', ')}`))
  }
}

module.exports = {
  rebuildCommand: rebuildCommand,
  rebuildModules: rebuildModules
}
