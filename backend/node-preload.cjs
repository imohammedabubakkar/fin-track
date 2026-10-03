// tsx derives its IPC socket name from os.userInfo().username when the
// process has no effective UID. Some managed Windows Node environments fail
// that OS lookup, so provide a stable non-secret fallback username.
const os = require("node:os");
const originalUserInfo = os.userInfo;
os.userInfo = (...args) => {
  try {
    return originalUserInfo(...args);
  } catch {
    return { username: process.env.USERNAME || "fintrack", uid: -1, gid: -1, shell: null, homedir: os.tmpdir() };
  }
};
