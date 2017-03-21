const execSync = require('child_process').execSync;
const fs = require('fs');
const util = require('util');

const warnString = `!!! WARNING !!!
You may not have enough watchers for development mode!

To increase amount of watchers temporarily, perform these commands:

    $ sudo sysctl fs.inotify.max_user_watches=524288
    $ sudo sysctl -p

If you like to make your limit permanent, use:

    $ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
    $ sudo sysctl -p

More info available here: https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers
!!! WARNING !!!`;

if (process.platform === 'linux' || process.platform === 'darwin') {
  const result = execSync('cat /proc/sys/fs/inotify/max_user_watches', [], { stdio: 'inherit' });
  const watcherCount = parseInt(result.toString(), 10);

  if (!isNaN(watcherCount) && watcherCount <= 9000) {
    console.warn(warnString);
  }
} else {
    // We're in windows or some other platform, god help us. :-)
}
