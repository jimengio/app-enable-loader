const getOptions = require("loader-utils").getOptions;

module.exports = function(source) {
  const options = getOptions(this);
  const enabledAllApps = options.enableAll;

  if (enabledAllApps) {
    return source;
  }

  const isAppsConfigFile = source.indexOf("export function getAppsConfig() {") != -1;

  if (isAppsConfigFile) {
    const includeApps = options.includes;
    const excludeApps = options.excludes;

    if (includeApps || excludeApps) {
      const importRegexp = /import\s(.*?)\sfrom\s".\/(.*?)\/config";/g;
      var match;
      let copySource = source;

      while ((match = importRegexp.exec(source))) {
        const importString = match[0];
        const importName = match[1];
        const importDir = match[2];
        const importNameRegexp = new RegExp(`\\s*?\\b${importName},\\n*?`);

        if (includeApps) {
          if (!includeApps.includes(importDir)) {
            copySource = copySource.replace(`${importString}\n`, "").replace(importNameRegexp, "");
          }
        } else if (excludeApps) {
          if (excludeApps.includes(importDir)) {
            copySource = copySource.replace(`${importString}\n`, "").replace(importNameRegexp, "");
          }
        }
      }

      return copySource;
    }
  }

  return source;
};
