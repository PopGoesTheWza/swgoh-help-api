# SWGoH.help API client for GAS

Google Apps Script client wrapper for the [SWGoH.help](https://api.swgoh.help/swgoh) API

For API access and support, please visit us on [Discord](https://discord.gg/kau4XTB)

## Getting Started

Within you Google document
1. open  the menu `Resources` and the option `Libraries...`
1. add the library by using this ID `1bMXMdwJmhTBxb4tBMEyEtw3jPVTzMZQz6NZ9Wm5-5b2MPWWFfqJVGa6n` and selecting the latest version
1. use the following snippet for simple testing
```javascript
function Test() {
  var settings = {
     username: "???",
     password: "???"
  };
  var client = new swgohhelpapi.module.exports.SwgohHelpApiClient(settings);
  var allycodes = [213176142, "524-173-817"];
  var json = client.fetchPlayer({
    allycodes: allycodes,
    project: {
      allyCode: true,
      name: true,
      level: false,
      guildName: false,
      stats: false,
      roster: false,
      arena: false,
      updated: true
    }
  }); // formated string allycode
  debugger
}
```

## Build your own copy

Prerequisite:
- Have [Google Clasp CLI](https://developers.google.com/apps-script/guides/clasp) installed
- (Recommended) setup your [TypeScript](https://developers.google.com/apps-script/guides/typescript) IDE

Steps:
1. Make a local copy of the GitHub repository.
1. Edit the file `.clasp.json` with the scriptId of your own new Google script
1. If needed, edit the source `.ts` files under the `dist/` directory
1. Use Clasp CLI to push the transpiled TypeScript into your Google script
1. (Optional) issue a Pull Request for your changes to be added to the official release

## About the Developer

Reach him on [Discord](https://discord.gg/ywzJEaQ)

## Contributions

Contributions and feature requests are welcome.

## License

[MIT License](https://github.com/labnol/apps-script-starter/blob/master/LICENSE) (c) Guillaume Contesso a.k.a. PopGoesTheWza