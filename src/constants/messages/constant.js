module.exports = {
  validStates: ["5c78f6f05fd9951541b888e0", "5c78f6f05fd9951541b888fa"],
  validCountries: ["5c78f6b0d5c10c14d6d50cc5"],
  countryCodes: [
    { country: "India", code: "+91" },
    { country: "Australia", code: "+61" },
    { country: "United States", code: "+1" },
    { country: "United Kingdom", code: "+44" },
    { country: "Philippines", code: "+63" },
    { country: "South Africa", code: "+27" }
  ],
  validCitys: [
    "5c78fb41b15d5b199d868491",
    "5c78fb41b15d5b199d868ee4",
    "5c78fb41b15d5b199d8686ce",
  ],
  locationType: {
    Point: "Point",
  },
  meetingStatus: {
    Created: "created",
    Accepted: "accepted",
    Declined: "rejected",
    deleted: "deleted",
    Updated: "updated"
  },
  roles: {
    Admin: "Admin",
    Client: "Client",
    User: "User",
  },
  gender: {
    Male: "Male",
    Female: "Female",
    nonBinary: "Non-Binary",
    NA: "N/A"
  },
  interest: {
    Music: "Music",
    Photography: "Photography",
    Cooking: "Cooking",
    Singing: "Singing",
    Yoga: "Yoga",
    Sports: "Sports",
    ArtDesiging: "ArtDesiging",
    Travelling: "Travelling",
  },
  attributes: {
    Pet: "Pet",
    Likes: "Likes",
    Interest: "Interest",
    About: "About",
    Avatars: "Avatars",
  },
  optionType:{
   Allergies:'allergies',
   Favouriteing:'favouriteing',
   Healthgoals:'healthgoals',
   Mealtype:'mealtype',
   Cookingtype:'cookingtype',
   Foodtype:'foodtype'
  },
  status: {
    Active: "active",
    Inactive: "inactive",
    NotAccepted:'notaccepted',
    Adopted:'adopted'
  },
  petType: {
    dog: "dog",
    cat: "cat",
    all:'all'
  },
  postType: {
    Original: "original",
    Share: "share",
    WelcomePost: "WelcomePost",
    Contest: "Contest",
    Adminads:"adminads",
    Quiz: "Quiz",
    memorialPost:'memorialPost',
    RecipePost:'recipePost',
    AdoptPost:'adoptPost',
    AdoptReqPost:'adoptreqPost',
    AstroPost:'astroPost'
  },
  ownerType: {
    userpost: "userpost",
    adminpost: "adminpost",
  },
  TransactionType:{
   LikeProfile:"Like Profile",
   LikePost : "Like Post",
   LikeRemoved:"Like Removed",
   ProfileCreated:"Profile Created",
   PetflixUploaded:"Uploaded Petflix",
   PetflixRemoved:"PetFlix Removed",
   PetAdoption:"Added a Pet for Adoption",
   PetAdoptionRemoved:"Removed Pet for Adoption",
   TributePet:"Added Tribute",
   WeeklyBonus : "Weekly Bonus",
   MonthlyBonus :"Monthly Bonus",
   ContestBonus :"Contest Bonus",
   AddPostPoints:'Post Added',
   PostRemoved:"Post Removed",
   VoucherRedeemed:"Voucher Redeemed",
   ReferEarning :"Refer Earn",
   Bonus:"Bonus"
  },
  MemberShip:{
  Silver:'Silver',
  Gold:'Gold',
  Platinum:'Platinum'
  },
  zodiacSign: {
    Aries: "Aries",
    Taurus: "Taurus",
    Gemini: "Gemini",
    Cancer: "Cancer",
    Leo: "Leo",
    Virgo: "Virgo",
    Libra: "Libra",
    Scorpio: "Scorpio",
    Sagittarius: "Sagittarius",
    Capricorn: "Capricorn",
    Aquarius: "Aquarius",
    Pisces: "Pisces",
  },
  likesDislikes: {
    Movies: "Movies",
    Pets: "Pets",
    Singing: "Singing",
    Travelling: "Travelling",
    Sports: "Sports",
    Partying: "Partying",
    ArtDesiging: "ArtDesiging",
    Driving: "Driving",
    Smoking: "Smoking",
  },
  element: {
    fire: "fire",
    air: "air",
    land: "land",
    water: "water",
  },
  action: {
    none: "none",
    likes: "like",
    dislike: "dislike",
    Block: "block",
    unfriended : "unfriended"
  },
  adoptaction: {
    requested:"requested",
   rejected:"rejected"
  },
  activityaction:{
   Like :'like',
   Comment:'comment',
   Share:'share',
   FriendRequest:'friendRequest',
   SwoofiMessage:'swoofimessage',
   ReceivedPawPoints:'Received Paw Points',
   DeductedPawPoints:"Paw Points Deducted",
   VoucherRedeemed:"Voucher Redeemed",
   VoucherRejected:"Voucher Rejected",
   ContestRating :"Contest Rating",
   AdminNotification:"Admin Notification"

  },
  moduleaction:{
   Post:'post',
   Comment:'comment',
   Profile:'profile',
   Petflix:'petflix',
   Swoofi:'swoofi',
   PawPoints:'Paw Points',
   Vouchers:'vouchers',
   Contest:'contest',
   Admin:'admin'
  },
  sosaction:{
   accepted:"accepted",
   declined:"declined",
   pending:"pending",
   report:"report"
  },
  sub_action: {
    none: "none",
    requested: "requested",
    accepted: "accepted",
    rejected: "rejected",
  },
  maritalStatus: {
    Married: "Married",
    Divorced: "Divorced",
    Single: "Single",
    Widowed: "Widowed"

  },
  message_type: {
    image: "image",
    document: "document",
    message: "message",
    meeting_status: "meeting_status",
    video: "video"
  },
  type: {
    online: "online",
    offline: "offline",
  },
  senderId: [
    "63b3fc05ab4549c96d56324f",
    "63bd03f4878ea014c608a401",
    "63bd42c0418786bbc9bce398",
    "63c0fd2fd3f9fd350dfe5617",
    "63d0d5bfe35684fdb4641b68",
    "63d0d5c7e35684fdb4641b6c",
    "63dd004be08dda08b8066c2a",
  ],
  receiverId: ["63cf97448e51ae34d176e866"],
  report: {
    Nudity: "Nudity and PornoGrapy",
    Solicitation: "Sexual exploitations and Solicitation ",
    Threatening: " Threatening  to  share  private images ",
    child: "Involves a child ",
  },
  reporttype: {
    Post: "Post",
    User: "User Profile",
  },
  requestType: {
    Normal: "normal",
    Red: "red",
    Blue: "blue",
  },
  friendStatus: {
    Accepted: "Accepted",
    rejected: "Rejected",
  },
  requestStatus: {
    requestSent: "requestSent",
  },
  matrimonial: {
    Married: "Married",
    Divorced: "Divorced",
    Single: "Single",
    Widowed: "Widowed",
    NA: "N/A"
  },
  socialTypes: {
    Apple: "apple",
    Google: "google",
    Facebook: "facebook"
  },
  mockedMobileNumbers: [
    "9876543211",
    "9876543212",
    "9876543213",
    "9876543214",
    "9876543215",
    "9876543216",
    "9876543210",
  ],
  device: {
    ANDROID: "android",
    IOS: "ios"
  },
  authMethod: {
    email: "email",
    mobile: "mobile"
  }
};
