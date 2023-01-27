#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const template = require("./template");

let metaData = {
  appName: "vscode-extension-pack",
  displayName: "VSCode Extension Pack",
  description: "VSCode Extension for App Developer",
  publisher: "publisher",
  version: "0.0.1",
  extensionPack: ["publisher.extensionName"],
};

/* Joining the current working directory with the appName. */
let projectPath = path.join(process.cwd(), metaData.appName);

const askAppName = () => {
  inquirer
    .prompt([
      {
        name: "appName",
        message: "What is your application name?",
        default: "vscode-extension-pack",
      },
    ])
    .then(({ appName }) => {
      metaData.appName = appName;
      projectPath = path.join(process.cwd(), appName);
      /* Checking if the folder exists and if not, it creates it. */
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
      }
      askDisplayName();
    });
};

askAppName();

const askDisplayName = () => {
  inquirer
    .prompt([
      {
        name: "displayName",
        message: "What is your Application Display name?",
        default: "VSCode Extension Pack",
      },
    ])
    .then(({ displayName }) => {
      metaData.displayName = displayName;
      askPublisher();
    });
};

const askPublisher = () => {
  inquirer
    .prompt([
      {
        name: "publisher",
        message: "Enter Your Publisher Id?",
        default: "publisher",
      },
    ])
    .then(({ publisher }) => {
      metaData.publisher = publisher;
      askVersion();
    });
};

const askVersion = () => {
  inquirer
    .prompt([
      {
        name: "version",
        message: "What is your Application Version?",
        default: "0.0.1",
      },
    ])
    .then(({ version }) => {
      metaData.version = version;
      askExtensionID();
    });
};

const askExtensionID = () => {
  inquirer
    .prompt([
      {
        name: "extensionsId",
        message:
          "Enter the Extensions Id need to be added to the ext? [separated by comma] (ex: ex1,ex2,ex3..)",
      },
    ])
    .then(({ extensionsId }) => {
      const ids = Array.from(new Set(extensionsId.trim().split(","))).filter(
        Boolean
      );
      metaData.extensionPack = [...ids];
      createProjectFiles();
    });
};

const createProjectFiles = () => {
  console.log("");
  createPackageJsonFile();
  copyIconFile();
  createVSCodeIgnoreFile();
  createReadMeFile();
  createChangelogFile();
  createVSCodeFolder();
  createLaunchJsonFile();
};

/* Writing the package.json file. */
const createPackageJsonFile = () => {
  const filePath = path.join(projectPath, "package.json");
  fs.writeFileSync(
    filePath,
    JSON.stringify(
      template.packageJson(
        metaData.appName,
        metaData.displayName,
        metaData.description,
        metaData.version,
        metaData.extensionPack,
        metaData.publisher
      ),
      null,
      2
    )
  );
  console.log("Created: ", filePath);
};

/* Writing the .vscodeignore file. */
const createVSCodeIgnoreFile = () => {
  const filePath = path.join(projectPath, ".vscodeignore");
  fs.writeFileSync(filePath, template.vscodeIgnore());
  console.log("Created: ", filePath);
};

/* Writing the README.md file. */
const createReadMeFile = () => {
  const filePath = path.join(projectPath, "README.md");
  fs.writeFileSync(
    filePath,
    template.readMeMd(metaData.displayName, metaData.description)
  );
  console.log("Created: ", filePath);
};

/* Writing the CHANGELOG.md file. */
const createChangelogFile = () => {
  const filePath = path.join(projectPath, "CHANGELOG.md");
  fs.writeFileSync(filePath, template.changeLog(metaData.version));
  console.log("Created: ", filePath);
};

/* Checking if the folder exists and if not, it creates it. */
const createVSCodeFolder = () => {
  if (!fs.existsSync(path.join(projectPath, ".vscode"))) {
    fs.mkdirSync(path.join(projectPath, ".vscode"));
  }
};

/* Writing the launch.json file. */
const createLaunchJsonFile = () => {
  const filePath = path.join(projectPath, ".vscode", "launch.json");
  fs.writeFileSync(filePath, JSON.stringify(template.launchJson(), null, 2));
  console.log("Created: ", filePath);
};

const copyIconFile = () => {
  const filePath = path.join(projectPath, "icon.png");
  const iconPath = path.join(__dirname, "icon.png");
  fs.copyFileSync(iconPath, filePath);
  console.log("Created: ", filePath);
};
