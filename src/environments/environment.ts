// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  userManagement: 'https://ricq54ie69.execute-api.ap-south-1.amazonaws.com/Dev/user',
  socialMedia: 'https://ricq54ie69.execute-api.ap-south-1.amazonaws.com/Dev/manageSM',
  contentManagement: 'https://ricq54ie69.execute-api.ap-south-1.amazonaws.com/Dev/cm',
  notification: 'https://ricq54ie69.execute-api.ap-south-1.amazonaws.com/Dev/notification',
  bitlyService: 'https://ricq54ie69.execute-api.ap-south-1.amazonaws.com/Dev/bitly',
  bitlyURL: 'https://bitly.com/oauth/authorize?client_id=f443a97aa78db3b083552ddbe3b1f510c31f9b25&redirect_uri=http://localhost:4200/bitlysuccess',
  linkPreview: 'https://ricq54ie69.execute-api.ap-south-1.amazonaws.com/Dev/SM_LinkPreview',
  rebrandly: 'https://ricq54ie69.execute-api.ap-south-1.amazonaws.com/Dev/SM_Rebrandly',
  feedUrl: 'https://ricq54ie69.execute-api.ap-south-1.amazonaws.com/Dev/feeds'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
