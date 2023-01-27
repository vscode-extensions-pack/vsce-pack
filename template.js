const date = require("date-and-time");
exports.packageJson = (
  appName,
  displayName,
  description,
  version,
  extensionPack,
  pubName
) => {
  return {
    name: appName,
    displayName: displayName,
    description: description,
    version: version,
    publisher: pubName,
    icon: "icon.png",
    engines: {
      vscode: "^1.74.0",
    },
    categories: ["Extension Packs"],
    // extensionPack: ["publisher.extensionName"],
    extensionPack: [...extensionPack],
  };
};

exports.vscodeIgnore = () => {
  return `.vscode/**
.vscode-test/**
.gitignore`;
};

exports.readMeMd = (displayName, description) => {
  return `# ${displayName}
## ${description}`;
};

exports.changeLog = (version) => {
  const now = new Date();
  return `# Change Log
    
## ${version} - ${date.format(now, "YYYY-MM-DD")}
- Initial release`;
};

exports.launchJson = () => {
  return {
    version: "0.2.0",
    configurations: [
      {
        name: "Extension",
        type: "extensionHost",
        request: "launch",
        args: ["--extensionDevelopmentPath=${workspaceFolder}"],
      },
    ],
  };
};
