export type PaymentStatus = {
  // Current activities
  meetingLevy: boolean;
  marriageRight: boolean;
  burialRight: boolean;
  childDedication: boolean;
  freeDonation: boolean;

  // Previous activities
  meetingLevy2023: boolean;
  burialRight2023: boolean;
  marriageRight2022: boolean;
};

export type Member = {
  id: string;
  name: string;
  regNumber: string;
  payments: PaymentStatus;
  /** Meeting levy due month (1-12) */
  levyMonth?: number;
};

export const members: Member[] = [
  {
    id: "1",
    name: "Christian Chiemela",
    regNumber: "AG-2023-001",
    levyMonth: 9, // September
    payments: {
      meetingLevy: false,
      marriageRight: true,
      burialRight: true,
      childDedication: false,
      freeDonation: true,
      meetingLevy2023: true,
      burialRight2023: true,
      marriageRight2022: true,
    },
  },
  {
    id: "2",
    name: "Agulanna Wisdom",
    regNumber: "AG-2023-002",
    payments: {
      meetingLevy: true,
      marriageRight: false,
      burialRight: false,
      childDedication: false,
      freeDonation: false,
      meetingLevy2023: true,
      burialRight2023: false,
      marriageRight2022: true,
    },
  },
  {
    id: "3",
    name: "Chiemerie Onyemachi",
    regNumber: "AG-2023-003",
    payments: {
      meetingLevy: true,
      marriageRight: false,
      burialRight: true,
      childDedication: false,
      freeDonation: true,
      meetingLevy2023: true,
      burialRight2023: false,
      marriageRight2022: false,
    },
  },
  {
    id: "4",
    name: "Gideon Ukaegbu",
    regNumber: "AG-2023-004",
    payments: {
      meetingLevy: true,
      marriageRight: true,
      burialRight: true,
      childDedication: true,
      freeDonation: true,
      meetingLevy2023: true,
      burialRight2023: true,
      marriageRight2022: true,
    },
  },
  {
    id: "5",
    name: "Onyebuchi Enwerem",
    regNumber: "AG-2023-005",
    payments: {
      meetingLevy: false,
      marriageRight: true,
      burialRight: false,
      childDedication: true,
      freeDonation: false,
      meetingLevy2023: true,
      burialRight2023: true,
      marriageRight2022: false,
    },
  },
  {
    id: "6",
    name: "Johnbosco Amadi",
    regNumber: "AG-2023-006",
    levyMonth: 6, // June
    payments: {
      meetingLevy: true,
      marriageRight: false,
      burialRight: false,
      childDedication: false,
      freeDonation: false,
      meetingLevy2023: false,
      burialRight2023: true,
      marriageRight2022: true,
    },
  },
  {
    id: "7",
    name: "Chiagozie Achilefu",
    regNumber: "AG-2023-007",
    payments: {
      meetingLevy: true,
      marriageRight: true,
      burialRight: true,
      childDedication: false,
      freeDonation: true,
      meetingLevy2023: true,
      burialRight2023: false,
      marriageRight2022: false,
    },
  },
  {
    id: "8",
    name: "Chimboy Onyekachi",
    regNumber: "AG-2023-008",
    payments: {
      meetingLevy: false,
      marriageRight: false,
      burialRight: true,
      childDedication: true,
      freeDonation: false,
      meetingLevy2023: false,
      burialRight2023: true,
      marriageRight2022: true,
    },
  },
  {
    id: "9",
    name: "Ekwueme Chisom",
    regNumber: "AG-2023-009",
    levyMonth: 12, // December
    payments: {
      meetingLevy: false,
      marriageRight: true,
      burialRight: false,
      childDedication: true,
      freeDonation: true,
      meetingLevy2023: true,
      burialRight2023: false,
      marriageRight2022: true,
    },
  },
  {
    id: "10",
    name: "Chukwuyere Kalu",
    regNumber: "AG-2023-010",
    payments: {
      meetingLevy: true,
      marriageRight: false,
      burialRight: false,
      childDedication: false,
      freeDonation: false,
      meetingLevy2023: false,
      burialRight2023: false,
      marriageRight2022: false,
    },
  },
  {
    id: "11",
    name: "Iroh Bekee",
    regNumber: "AG-2023-011",
    payments: {
      meetingLevy: true,
      marriageRight: true,
      burialRight: true,
      childDedication: true,
      freeDonation: true,
      meetingLevy2023: true,
      burialRight2023: true,
      marriageRight2022: true,
    },
  },
];

export const validRegNumbers = members.map((m) => m.regNumber);

export type ActivityDetail = {
  title: string;
  description: string;
  paymentKey: keyof PaymentStatus;
  type: "general" | "event";
  amount?: string;
  /** Hosts/celebrants for event-type activities */
  hosts?: string[];
  /** Scheduled levy members with their due month name */
  levySchedule?: { name: string; month: string; regNumber: string }[];
};

export const activitiesInfo: Record<string, ActivityDetail> = {
  "meeting-levy": {
    title: "Meeting Levy",
    description:
      "Quarterly levy of ₦3,000 per member. Due every three months — June (Johnbosco Amadi), September (Christian Chiemela), December (Ekwueme Chisom).",
    paymentKey: "meetingLevy",
    type: "general",
    amount: "₦3,000",
    levySchedule: [
      { name: "Johnbosco Amadi",    month: "June",      regNumber: "AG-2023-006" },
      { name: "Christian Chiemela", month: "September", regNumber: "AG-2023-001" },
      { name: "Ekwueme Chisom",     month: "December",  regNumber: "AG-2023-009" },
    ],
  },
  "marriage-right": {
    title: "Marriage Right",
    description:
      "Support contribution of ₦12,500 paid by each member towards the marriage ceremony of a fellow member.",
    paymentKey: "marriageRight",
    type: "event",
    amount: "₦12,500",
    hosts: ["Agulanna Wisdom"],
  },
  "burial-right": {
    title: "Burial Right",
    description:
      "Consolation support of 1 crate of beer + ₦5,000 contributed by each member towards the burial rites of a fellow member.",
    paymentKey: "burialRight",
    type: "event",
    amount: "1 crate of beer + ₦5,000",
    hosts: ["Chiemerie Onyemachi"],
  },
  "child-dedication": {
    title: "Child Dedication",
    description:
      "Joyous contribution of ₦6,250 from each member celebrating the birth and dedication of a child by a fellow member.",
    paymentKey: "childDedication",
    type: "event",
    amount: "₦6,250",
    hosts: ["Gideon Ukaegbu", "Onyebuchi Enwerem"],
  },
  "free-donation": {
    title: "Free Donations",
    description:
      "Voluntary contributions from members and well-wishers to support community projects and charitable causes.",
    paymentKey: "freeDonation",
    type: "general",
  },
};

export const previousActivitiesInfo: Record<string, ActivityDetail> = {
  "meeting-levy-2023": {
    title: "Meeting Levy (2023)",
    description:
      "Archived quarterly levy records of ₦3,000 per member for the year 2023.",
    paymentKey: "meetingLevy2023",
    type: "general",
    amount: "₦3,000",
  },
  "burial-right-2023": {
    title: "Burial Right (2023)",
    description:
      "Archived consolation support (1 crate of beer + ₦5,000) contributed for burial rites in 2023.",
    paymentKey: "burialRight2023",
    type: "event",
    amount: "1 crate of beer + ₦5,000",
    hosts: ["Chukwuyere Kalu"],
  },
  "marriage-right-2022": {
    title: "Marriage Right (2022)",
    description:
      "Archived support fund of ₦12,500 per member for marriage ceremonies in 2022.",
    paymentKey: "marriageRight2022",
    type: "event",
    amount: "₦12,500",
    hosts: ["Iroh Bekee"],
  },
};

export const aboutInfo = {
  history:
    "The Agumba Age Grade of Amaisii Community was founded on the principles of brotherhood, unity, and communal progress. Formed by a collective of vibrant youths, our organisation has grown into a formidable pillar of support for our community.",
  motto: "Unity, Progress, and Brotherhood",
};

export const paymentAccountDetails = {
  bankName: "First Bank of Nigeria",
  accountName: "Agumba Age Grade Amaisii",
  accountNumber: "1234567890",
};
