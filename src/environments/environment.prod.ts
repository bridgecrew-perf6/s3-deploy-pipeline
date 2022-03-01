// export const environment = {
//   production: true,
//   userManagement: 'https://api.storefries.com/user',
//   socialMedia: 'https://api.storefries.com/manageSM',
//   contentManagement: 'https://api.storefries.com/cm',
//   notification: 'https://api.storefries.com/notification',
//   feedUrl: 'https://api.storefries.com/feeds'
// };
export const environment = {
  production: true,
  userManagement: 'https://e9a45i8ip3.execute-api.ap-south-1.amazonaws.com/Dev/user',
  socialMedia:'https://e9a45i8ip3.execute-api.ap-south-1.amazonaws.com/Dev/manageSM',
  contentManagement:'https://e9a45i8ip3.execute-api.ap-south-1.amazonaws.com/Dev/cm',
  notification:'https://e9a45i8ip3.execute-api.ap-south-1.amazonaws.com/Dev/notification',
  bitlyService:'https://e9a45i8ip3.execute-api.ap-south-1.amazonaws.com/Dev/bitly',
  bitlyURL:'https://bitly.com/oauth/authorize?client_id=f443a97aa78db3b083552ddbe3b1f510c31f9b25&redirect_uri=http://localhost:4200/bitlysuccess',
  linkPreview:'https://e9a45i8ip3.execute-api.ap-south-1.amazonaws.com/Dev/SM_LinkPreview',
  rebrandly:'https://e9a45i8ip3.execute-api.ap-south-1.amazonaws.com/Dev/SM_Rebrandly',
  feedUrl:'https://e9a45i8ip3.execute-api.ap-south-1.amazonaws.com/Dev/feeds'
};