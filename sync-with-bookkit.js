const path = require("path");
const {AppClient} = require("uu_appg01_server-client");

const handleMixins = require("./design-mapping/mixins.js");
const handleProps = require("./design-mapping/props.js");
const handleInterface = require("./design-mapping/interface.js");
const handleStatics = require("./design-mapping/statics.js");
const handleInfo = require("./design-mapping/info.js");
const handleRouteInfo = require("./design-mapping/route-info.js");
const handleUveInfo = require("./design-mapping/uve-info.js");
const handleCmps = require("./design-mapping/cmps.js");
const handleDesc = require("./design-mapping/desc.js");


const fileModule = require("./helpers/file-module.js");
const textToModule = require("./helpers/to-module-name.js");
const prefix = require("./helpers/prefix-name.js");
const asyncForEach = require("./helpers/async-foreach.js");
const readFolder = require("./helpers/read-folder.js");

//

const ensureDirectory = require("./helpers/ensure-directory.js");


const FROM = 'C:\\projects\\uu\\uaf\\uu_jokesg01-uu5\\uu_jokes_main-design';

const backup = require("./helpers/backup.js")(FROM);

const token = "...oidc token";

const url = "https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-6aae4ea575d14fd59108ce815e25fe59/loadPage";
const updateUrl = "https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-6aae4ea575d14fd59108ce815e25fe59/updatePage";

const askServer = async (pageCode) => {
  try {
    let response = await AppClient.get(url, {
      code: pageCode
    }, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    // return JSON.parse(response);
    await backup(response);
    return response
  } catch (e) {
    console.error(e)
  }
};

const sendToServer = async (data) => {
  // console.log(data);
  return await AppClient.post(updateUrl, data, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

const getFile = require("./helpers/get-file.js");
const parseUU5 = require("./helpers/uu5/parse.js");
const toUU5 = require("./helpers/uu5/to.js");

const updatePage = async (target, base_path) => {
  try {
    let fileData = await getFile(target);
    if(!fileData.pageCode || fileData.pageCode.length === 0) {
      console.log("no page set for ", fileData.name);

      return;
    }
    const cmpType = fileData.type || "component";
    console.log("processing", fileData.name);
    let pageData = await askServer(fileData.pageCode);

    const module = fileModule(target);

    parseUU5(pageData.body);

    let infoHandler;
    switch (cmpType) {
      case "uve":
        infoHandler = handleUveInfo;
        break;
      case "route":
        infoHandler = handleRouteInfo;
        break;
      default:
        infoHandler = handleInfo
    }

    handleMixins(pageData.body, fileData.mixins);
    handleProps(pageData.body, fileData.propTypes);
    handleStatics(pageData.body, fileData.statics);
    infoHandler(pageData.body, fileData, {
      appName: "UuJokes",
      module: module
    });
    handleInterface(pageData.body, fileData.interface);
    await handleCmps(pageData.body, fileData.dependencies, target, base_path);

    toUU5(pageData.body);

    // update name and description

    if(cmpType === "component") {
      parseUU5(pageData.desc);
      handleDesc(pageData.desc, fileData.name);
      toUU5(pageData.desc);

      Object.keys(pageData.name).forEach(lang => {
        pageData.name[lang] = fileData.name
      });
    }

    let updateData = {};

    updateData.sectionList = pageData.body; // WTF?!
    const copyKeys = ["code", "sys", "name", "desc"];

    copyKeys.forEach(key => {
      updateData[key] = pageData[key];
    });

    // console.log(updateData);

    return await sendToServer(updateData);
    // return Promise.resolve("ok");
  } catch (e) {
    console.error(e)
  }
};


const getPage = async () => {
  try {
    const BASE_PATH = path.resolve(FROM, "client");
    let components = await readFolder(BASE_PATH);
    // let components = [
    //   path.resolve(FROM, "client", "category", "ready.json")
    // ];
    await asyncForEach(components, async (file) => {
      return await updatePage(file, BASE_PATH);
    });
    return "ok";
  } catch (e) {
    console.error("error",e)
  }
};

getPage().then(res => console.log("result", res));