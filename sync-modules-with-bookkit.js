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

const FROM = 'C:\\projects\\uu\\uaf\\uu_jokesg01-uu5\\uu_jokes_main-design';

const backup = require("./helpers/backup.js")(FROM);

const token = "...oidc token";

const url = "https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-71f8d7b5cfdc4336b0abfe47b3cb237b/loadPage";
const updateUrl = "https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-71f8d7b5cfdc4336b0abfe47b3cb237b/updatePage";

const askServer = async (pageCode) => {
  try {
    let response = await AppClient.get(url, {
      code: pageCode
    }, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });
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

const updatePage = async (target, pageCode) => {
  try {
    let dirPath = path.resolve(FROM, "client", target);
    let dirContent = await readFolder(dirPath, {recursive: true});

    let pageData = await askServer(pageCode);

    // const module = fileModule(target);

    parseUU5(pageData.body);

    let moduleCompoennts = {};
    dirContent.forEach(file => {
      let relDir = path.dirname(file).replace(dirPath, "").substr(1);
      if(relDir) {
        relDir += "/";
      }
      let relPath = `./${relDir}${path.basename(file, ".json")}`;
      moduleCompoennts[relPath] = {};
    });


    await handleCmps(pageData.body, moduleCompoennts, path.resolve(dirPath, "extra"));

    toUU5(pageData.body);


    let updateData = {};

    updateData.sectionList = pageData.body; // WTF?!
    const copyKeys = ["code", "sys"];

    copyKeys.forEach(key => {
      updateData[key] = pageData[key];
    });

    console.log(updateData);

    return await sendToServer(updateData);
    // return Promise.resolve("ok");
  } catch (e) {
    console.error(e)
  }
};


const getPage = async () => {
  try {
    let components = {
      // "bricks": "48875910",
      // "category": "63227089",
      // "core": "89176157",
      // "jokes": "94554271",
      // "jokes/filter": "85220862",
      "": "07852547"
    };
    await asyncForEach(Object.keys(components), async (file) => {
      return await updatePage(file, components[file]);
    });
    // return await updatePage();
    return "ok";
  } catch (e) {
    console.error("error",e)
  }
};

getPage().then(res => console.log("result", res));