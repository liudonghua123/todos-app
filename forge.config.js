const path = require('path');
const package = require('./package.json');

module.exports = {
  packagerConfig: {
    dir: 'build',
    icon: path.resolve(__dirname, 'assets', 'icon'),
    appBundleId: 'com.liudonghua.todos-app',
    appCategoryType: 'public.app-category.developer-tools',
    win32metadata: {
      CompanyName: 'Donghua Liu',
      OriginalFilename: 'todos-app'
    },
    osxSign: {
      identity: 'Developer ID Application: Donghua Liu (TODO)'
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'todos-app',
        authors: 'Donghua Liu',
        exe: 'todos-app.exe',
        noMsi: true,
        remoteReleases: '',
        setupExe: `todos-app-win32-${package.version}-setup-${
          process.arch
        }.exe`,
        setupIcon: path.resolve(__dirname, 'assets', 'icon.ico'),
        certificateFile: process.env.WINDOWS_CERTIFICATE_FILE,
        certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD
      }
    },
    {
      // https://v6.electronforge.io/makers/zip
      name: '@electron-forge/maker-zip'
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      // https://js.electronforge.io/maker/deb/interfaces/makerdebconfigoptions
      config: {
        name: 'todos-app',
        maintainer: 'liudonghua123',
        homepage: 'liudonghua.com',
        icon: path.resolve(__dirname, 'assets', 'icon.ico')
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      // https://js.electronforge.io/maker/rpm/interfaces/makerrpmconfigoptions
      config: {
        name: 'todos-app',
        maintainer: 'liudonghua123',
        homepage: 'liudonghua.com',
        icon: path.resolve(__dirname, 'assets', 'icon.ico')
      }
    }
  ]
};
