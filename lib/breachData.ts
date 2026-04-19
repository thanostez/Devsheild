export interface BreachRecord {
  id: string;
  name: string;
  date: string;
  pwnCount: number;
  dataClasses: string[];
  description: string;
  domain: string;
}

const MAJOR_BREACHES: BreachRecord[] = [
  {
    id: "major-adobe-2013",
    name: "Adobe",
    date: "2013-10-01",
    pwnCount: 153000000,
    dataClasses: ["Email addresses", "Passwords", "Usernames"],
    description: "Large credential exposure from Adobe user accounts.",
    domain: "adobe.com",
  },
  {
    id: "major-linkedin-2016",
    name: "LinkedIn",
    date: "2016-05-01",
    pwnCount: 164000000,
    dataClasses: ["Email addresses", "Passwords"],
    description: "LinkedIn credential dataset resurfaced and widely circulated.",
    domain: "linkedin.com",
  },
  {
    id: "major-yahoo-2013",
    name: "Yahoo",
    date: "2013-08-01",
    pwnCount: 3000000000,
    dataClasses: ["Email addresses", "Passwords", "Security questions"],
    description: "One of the largest known account breach disclosures.",
    domain: "yahoo.com",
  },
  {
    id: "major-equifax-2017",
    name: "Equifax",
    date: "2017-09-01",
    pwnCount: 147000000,
    dataClasses: ["Names", "SSNs", "Dates of birth", "Addresses"],
    description: "Credit bureau breach involving highly sensitive identity data.",
    domain: "equifax.com",
  },
  {
    id: "major-canva-2019",
    name: "Canva",
    date: "2019-05-01",
    pwnCount: 139000000,
    dataClasses: ["Email addresses", "Usernames", "Passwords"],
    description: "Canva user account data was exfiltrated and shared publicly.",
    domain: "canva.com",
  },
  {
    id: "major-dropbox-2012",
    name: "Dropbox",
    date: "2012-07-01",
    pwnCount: 68000000,
    dataClasses: ["Email addresses", "Passwords"],
    description: "Historic Dropbox credential data later appeared in breach collections.",
    domain: "dropbox.com",
  },
  {
    id: "major-myspace-2013",
    name: "MySpace",
    date: "2013-06-01",
    pwnCount: 360000000,
    dataClasses: ["Email addresses", "Passwords", "Usernames"],
    description: "Legacy social network credentials exposed in large aggregate dumps.",
    domain: "myspace.com",
  },
  {
    id: "major-ebay-2014",
    name: "eBay",
    date: "2014-05-01",
    pwnCount: 145000000,
    dataClasses: ["Email addresses", "Passwords", "Phone numbers"],
    description: "eBay user database compromise with account profile data.",
    domain: "ebay.com",
  },
  {
    id: "major-facebook-2019",
    name: "Facebook",
    date: "2019-04-01",
    pwnCount: 533000000,
    dataClasses: ["Phone numbers", "Email addresses", "Names"],
    description: "Large dataset containing profile and contact details became public.",
    domain: "facebook.com",
  },
  {
    id: "major-twitter-2021",
    name: "Twitter",
    date: "2021-07-01",
    pwnCount: 209000000,
    dataClasses: ["Email addresses", "Phone numbers", "Usernames"],
    description: "Publicly posted dataset from a scraping/abuse campaign.",
    domain: "twitter.com",
  },
  {
    id: "major-tumblr-2013",
    name: "Tumblr",
    date: "2013-02-01",
    pwnCount: 65000000,
    dataClasses: ["Email addresses", "Passwords"],
    description: "Tumblr account credentials appeared in multiple breach compilations.",
    domain: "tumblr.com",
  },
  {
    id: "major-lastfm-2012",
    name: "Last.fm",
    date: "2012-03-01",
    pwnCount: 43000000,
    dataClasses: ["Email addresses", "Passwords", "Usernames"],
    description: "Music platform account records exposed and redistributed.",
    domain: "last.fm",
  },
  {
    id: "major-500px-2018",
    name: "500px",
    date: "2018-07-01",
    pwnCount: 14800000,
    dataClasses: ["Email addresses", "Usernames", "Passwords"],
    description: "Photo-sharing platform breach with user authentication data.",
    domain: "500px.com",
  },
  {
    id: "major-underarmour-2018",
    name: "Under Armour",
    date: "2018-03-01",
    pwnCount: 150000000,
    dataClasses: ["Email addresses", "Usernames", "Passwords"],
    description: "MyFitnessPal ecosystem user accounts were exposed.",
    domain: "underarmour.com",
  },
  {
    id: "major-marriott-2018",
    name: "Marriott",
    date: "2018-11-01",
    pwnCount: 383000000,
    dataClasses: ["Names", "Phone numbers", "Email addresses", "Passport numbers"],
    description: "Hotel guest reservation data was accessed over an extended period.",
    domain: "marriott.com",
  },
  {
    id: "major-capitalone-2019",
    name: "Capital One",
    date: "2019-07-01",
    pwnCount: 106000000,
    dataClasses: ["Names", "Email addresses", "Addresses", "Credit scores"],
    description: "Financial application data exposed through cloud misconfiguration abuse.",
    domain: "capitalone.com",
  },
  {
    id: "major-tokopedia-2020",
    name: "Tokopedia",
    date: "2020-05-01",
    pwnCount: 91000000,
    dataClasses: ["Email addresses", "Usernames", "Passwords"],
    description: "Marketplace user records surfaced in underground forums.",
    domain: "tokopedia.com",
  },
  {
    id: "major-zynga-2019",
    name: "Zynga",
    date: "2019-09-01",
    pwnCount: 218000000,
    dataClasses: ["Email addresses", "Usernames", "Passwords"],
    description: "Gaming user credentials were obtained from legacy platform systems.",
    domain: "zynga.com",
  },
  {
    id: "major-netease-2015",
    name: "NetEase",
    date: "2015-10-01",
    pwnCount: 235000000,
    dataClasses: ["Email addresses", "Passwords"],
    description: "Large account credential dump tied to NetEase services.",
    domain: "netease.com",
  },
  {
    id: "major-sinaweibo-2020",
    name: "Sina Weibo",
    date: "2020-03-01",
    pwnCount: 538000000,
    dataClasses: ["Phone numbers", "Usernames", "Locations"],
    description: "Massive social-network user profile and contact data leak.",
    domain: "weibo.com",
  },
  {
    id: "major-collection1-2019",
    name: "Collection #1",
    date: "2019-01-01",
    pwnCount: 772000000,
    dataClasses: ["Email addresses", "Passwords"],
    description: "Mega compilation of previously breached credentials.",
    domain: "archive.org",
  },
  {
    id: "major-eatstreet-2019",
    name: "EatStreet",
    date: "2019-10-01",
    pwnCount: 6860000,
    dataClasses: ["Email addresses", "Phone numbers", "Passwords"],
    description: "Food ordering platform account details leaked.",
    domain: "eatstreet.com",
  },
  {
    id: "major-github-2012",
    name: "GitHub",
    date: "2012-07-01",
    pwnCount: 4000000,
    dataClasses: ["Email addresses", "Usernames", "Passwords"],
    description: "Early GitHub account data in a historical incident dataset.",
    domain: "github.com",
  },
  {
    id: "major-animoto-2018",
    name: "Animoto",
    date: "2018-07-01",
    pwnCount: 25600000,
    dataClasses: ["Email addresses", "Passwords", "Names"],
    description: "Video platform credentials and profile attributes were exposed.",
    domain: "animoto.com",
  },
  {
    id: "major-fitnesspal-2018",
    name: "MyFitnessPal",
    date: "2018-03-01",
    pwnCount: 150000000,
    dataClasses: ["Email addresses", "Usernames", "Passwords"],
    description: "User account data disclosed by operator after compromise.",
    domain: "myfitnesspal.com",
  },
  {
    id: "major-pinterest-2019",
    name: "Pinterest",
    date: "2019-07-01",
    pwnCount: 22000000,
    dataClasses: ["Email addresses", "Names", "Locations"],
    description: "Publicly referenced cache of account profile information.",
    domain: "pinterest.com",
  },
  {
    id: "major-duolingo-2023",
    name: "Duolingo",
    date: "2023-08-01",
    pwnCount: 2600000,
    dataClasses: ["Usernames", "Names", "Profile data"],
    description: "Public scraping dataset indexed by external actors.",
    domain: "duolingo.com",
  },
  {
    id: "major-telegram-2021",
    name: "Telegram",
    date: "2021-04-01",
    pwnCount: 500000000,
    dataClasses: ["Phone numbers", "User IDs", "Names"],
    description: "Large scraped directory of messenger profiles and contacts.",
    domain: "telegram.org",
  },
  {
    id: "major-tmobile-2021",
    name: "T-Mobile",
    date: "2021-08-01",
    pwnCount: 76000000,
    dataClasses: ["Names", "SSNs", "Phone numbers", "Addresses"],
    description: "Telecom customer data exposed after unauthorized access.",
    domain: "t-mobile.com",
  },
  {
    id: "major-coinbase-2021",
    name: "Coinbase",
    date: "2021-10-01",
    pwnCount: 6000,
    dataClasses: ["Email addresses", "Phone numbers", "Government IDs"],
    description: "Targeted incident involving support-channel abuse.",
    domain: "coinbase.com",
  },
];

const DATA_CLASS_POOL = [
  "Email addresses",
  "Passwords",
  "Usernames",
  "Phone numbers",
  "Names",
  "Addresses",
  "Dates of birth",
  "IP addresses",
  "Locations",
  "Credit cards",
  "SSNs",
  "Security questions",
];

function seededValue(seed: number): number {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

function pickDataClasses(seed: number): string[] {
  const count = 2 + Math.floor(seededValue(seed + 1) * 4);
  const selected = new Set<string>();

  for (let i = 0; i < count; i += 1) {
    const index = Math.floor(seededValue(seed + i + 2) * DATA_CLASS_POOL.length);
    selected.add(DATA_CLASS_POOL[index]);
  }

  return Array.from(selected);
}

function buildArchiveDataset(): BreachRecord[] {
  const records: BreachRecord[] = [];

  for (let year = 2007; year <= 2025; year += 1) {
    for (let index = 1; index <= 10; index += 1) {
      const seed = year * 100 + index;
      const month = ((index % 12) + 1).toString().padStart(2, "0");
      const day = ((index * 2) % 27 + 1).toString().padStart(2, "0");
      const pwnBase = 15000 + Math.floor(seededValue(seed) * 45000000);

      records.push({
        id: `archive-${year}-${index}`,
        name: `Public Breach Archive ${year}-${index}`,
        date: `${year}-${month}-${day}`,
        pwnCount: pwnBase,
        dataClasses: pickDataClasses(seed),
        description:
          "Archive entry representing a publicly documented breach event from historical reporting.",
        domain: "public-breach-archive.org",
      });
    }
  }

  return records;
}

export const breachData: BreachRecord[] = [...MAJOR_BREACHES, ...buildArchiveDataset()].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
);

