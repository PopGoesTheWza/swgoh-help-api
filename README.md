# SWGoH.help API client for GAS v1.0.3_beta

Google Apps Script client wrapper for the [SWGoH.help](https://api.swgoh.help/swgoh) API.

For API access and support, please visit us on [Discord](https://discord.gg/kau4XTB).

## Getting Started

Within your Google document:
1. open  the menu `Resources` and select the option `Libraries...`
1. add the library by using this script ID `1bMXMdwJmhTBxb4tBMEyEtw3jPVTzMZQz6NZ9Wm5-5b2MPWWFfqJVGa6n` and selecting the latest version
1. use the following snippet for simple testing:
```javascript
function Test() {
  // Fill in with your swgoh.help API credentials
  var settings = {
     username: "???",
     password: "???"
  };
  var client = new swgohhelpapi.module.exports.Client(settings);
  var allycodes = [213176142];
  var json = client.fetchPlayer({
    allycodes: allycodes,
    project: {
      allyCode: true,
      name: true,
      updated: true
    }
  });
  debugger;
}
```

## Documentation

[TypeDoc documentation](https://popgoesthewza.github.io/swgoh-help-api/)

## Promotion

This client is powered by ![alt text](https://www.swgoh.help/img/logo.png "swgoh.help").

Consider donating to its [Patreon](https://www.patreon.com/user?u=470177).

> Help us continue to scale and support more players across a wider range of tools! Every dollar helps us to boost resources and increase stability. Your donation will help ensure a continued data stream for your favourite swgoh tools.

## Build your own copy

Prerequisite:
- Have [Google Clasp CLI](https://developers.google.com/apps-script/guides/clasp) installed
- (Recommended) setup your [TypeScript](https://developers.google.com/apps-script/guides/typescript) IDE

Steps:
1. Make a local copy of the GitHub repository
1. Edit the file `.clasp.json` with the scriptId of your own new Google script
1. If needed, edit the source `.ts` files under the `src/` directory
1. Use Clasp CLI to push the transpiled TypeScript into your Google script
1. (Optional) issue a Pull Request for your changes to be added to the official release

## About the Developer

Reach him on [Discord](https://discord.gg/ywzJEaQ)

## Contributions

Contributions and feature requests are welcome.

## License

[MIT License](https://github.com/labnol/apps-script-starter/blob/master/LICENSE) (c) Guillaume Contesso a.k.a. PopGoesTheWza