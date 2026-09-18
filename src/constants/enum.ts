export enum ERouterPaths {
  SIGNIN = "/signin",
  SIGNUP = "/signup",
  AUTH_CALLBACK = "/auth/callback",
  HOME = "/",
  ACCOMODATION = "/profile/accomodation",
  TEAMS = "/profile/teams",
  PROFILE = "/profile",
  INVITATION = "/profile/invitations",
  EVENTS = "/events",
  REGISTER = "/register",
  DASHBOARD = "/dashboard",
  LEADERBOARD = "/leaderboard",
  EVENTSCHEDULE = "/event-schedule",
  NOT_FOUND = "/*",
  SERVER_ERROR = "/500",
}

export enum ELocalStorageKeys {
  AUTH_TOKEN = "authToken",
  AUTH_STORE = "APISTORE",
}

export enum EReactQueryEnum {
  PROFILE = "profile",
}

export enum ApiPaths {
  //PUBLIC
  COLLEGE = "/college",
  //Auth
  GENERATE_OTP = "/auth/generateOTP/mail",
  GENERATE_OTP_PHONE = "/auth/generateOTP/phone",
  VERIFY_OTP = "/auth/generateOTP/verify-phone",
  LOGIN = "/auth/login",
  CHECK_EMAIL = "/auth/check-email",
  REGISTER = "/auth/register",
  VERIFY_OTP_MAIL = "/auth/generateOTP/verify-mail",

  //USER
  USER = "/me/user",
  PRE_SIGNEDIN_PROFILE = "/me/user/pre-signed-url/profile",

  //TEAMS
  TEAM = "/me/team",
  TEAM_INVITE = "/me/invite",
  TEAM_INVITE_PROCESS = "/invite/process",

  //EVENTS
  EVENT = "/event",
  LOGO = "/pre-signed-url/logo",
  HEADER = "/pre-signed-url/header",
  EVENT_REGISTER = "/register",
  EVENT_UNREGISTER = "/un-register",

  REGISTERED_EVENT = "/me/event",

  //WAITING ROOM (Enrolled) - a team event's pool of people with no team yet.
  //Paths are built as `${MY_ENROLLED}/${eventId}/enrolled` and
  //`${EVENT}/${eventId}/enrolled`, matching the API's /me/... convention.
  MY_ENROLLED = "/me/event",
  ENROLLED = "/enrolled",
  ENROLLED_LISTING = "/enrolled/listing",
  ENROLLED_INVITE = "/invite",
  //ACCOMODATION
  ACCOMODATION = "/me/accommodation",
  //LEADERBOARD
  LEADERBOARD = "/leaderboard",
  LEADERBOARD_USERS = "/leaderboard/users",
  LEADERBOARD_TEAMS = "/leaderboard/teams",
  LEADERBOARD_COLLEGES = "/leaderboard/colleges",
}

export enum LocalStorageEnum {
  API_STORE = "APISTORE",
}
