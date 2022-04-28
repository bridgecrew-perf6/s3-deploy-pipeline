export class SocialProfile {
  email?: string;
  socialMedia?: SocialMediDetails[]
}

export class SocialMediDetails {
  name?: string;
  fbpages?: FBPageDetails[];
  screenName?: String;
  userId?: String;
}
export class FBPageDetails {
  name?: String;
  category?: String;
  access_token?: String;
  id?: String;
}

export class SocialDropDown {
  socialId?: String;
  socialName?: String;
  socialType?: String;
}
