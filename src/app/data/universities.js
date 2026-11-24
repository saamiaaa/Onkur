
const universities = [
  {
    id: "du",
    name: "University of Dhaka",
    shortName: "DU",
    country: "Bangladesh",
    city: "Dhaka",
    type: "Public",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Computer Science", "Business", "Engineering", "Arts", "Science"],
    description:
      "A major public university in Bangladesh with a broad range of academic disciplines.",
    website: "https://www.du.ac.bd",
    budget: {
      amount: null,
      currency: "BDT",
      period: "Programme-dependent",
      summary:
        "Public university fees vary by department and programme. Check the latest admission prospectus for the exact amount.",
    },
    scholarships: {
      summary:
        "Offers department-based merit scholarships, need-based financial assistance and trust-fund scholarships. Availability and amounts vary.",
      opportunities: [
        "Departmental merit scholarships",
        "Need-based financial assistance",
        "Trust-fund scholarships",
      ],
    },
    officialLinks: {
      tuition: "https://www.du.ac.bd",
      scholarships: "https://www.du.ac.bd/scholarship_financial_aid",
      admission: "https://admission.eis.du.ac.bd",
    },
    dataNote: "Fees vary by department. No single university-wide undergraduate fee was confirmed.",
  },
  {
    id: "buet",
    name: "Bangladesh University of Engineering and Technology",
    shortName: "BUET",
    country: "Bangladesh",
    city: "Dhaka",
    type: "Public",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Engineering", "Computer Science", "Architecture"],
    description:
      "A public engineering and technology university in Bangladesh.",
    website: "https://www.buet.ac.bd",
    budget: {
      amount: null,
      currency: "BDT",
      period: "Programme-dependent",
      summary:
        "Public university fees are programme- and term-dependent. Consult the official admission information for the current fee schedule.",
    },
    scholarships: {
      summary:
        "BUET lists technical scholarships for enrolled undergraduate students, term-result merit scholarships and Dean's List scholarships.",
      opportunities: [
        "Undergraduate technical scholarship",
        "Term-result merit scholarship",
        "Dean's List scholarship",
        "Trust-funded scholarships",
      ],
    },
    officialLinks: {
      tuition: "https://www.buet.ac.bd",
      scholarships: "https://www.buet.ac.bd/web/angular_app/modules/admission/admission.tpl.html",
      admission: "https://www.buet.ac.bd",
    },
    dataNote: "A current consolidated undergraduate fee amount was not confirmed.",
  },
  {
    id: "nsu",
    name: "North South University",
    shortName: "NSU",
    country: "Bangladesh",
    city: "Dhaka",
    type: "Private",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Computer Science", "Business", "Engineering", "Health"],
    description:
      "A private university offering programs across several academic fields.",
    website: "https://www.northsouth.edu",
    budget: {
      amount: 8000,
      currency: "BDT",
      period: "Per credit",
      summary:
        "Undergraduate tuition is Tk 8,000 per credit from Spring 2026. Admission and semester fees are additional.",
    },
    scholarships: {
      summary:
        "Tuition waivers may be available under university scholarship and financial-aid policies. Eligibility depends on the applicable policy.",
      opportunities: [
        "Merit-based tuition waivers",
        "Need-based financial assistance",
        "Other university tuition-waiver schemes",
      ],
    },
    officialLinks: {
      tuition: "https://www.northsouth.edu/tuition-fees/",
      scholarships: "https://www.northsouth.edu",
      admission: "https://admissions.northsouth.edu",
    },
    dataNote: "Per-credit tuition is not the complete degree cost. Other fees apply.",
  },
  {
    id: "bracu",
    name: "BRAC University",
    shortName: "BRACU",
    country: "Bangladesh",
    city: "Dhaka",
    type: "Private",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Computer Science", "Business", "Engineering", "Arts", "Health"],
    description:
      "A private university with programs in technology, business, and other disciplines.",
    website: "https://www.bracu.ac.bd",
    budget: {
      amount: 8250,
      currency: "BDT",
      period: "Per credit",
      summary:
        "The published rate for most undergraduate programmes is Tk 8,250 per credit for new students from Spring 2027. Some programmes have different rates and additional fees apply.",
    },
    scholarships: {
      summary:
        "Offers merit-based scholarships and financial aid for eligible undergraduate students, including support for students from financially disadvantaged backgrounds.",
      opportunities: [
        "Merit-based scholarships",
        "Need-based financial aid",
        "Sir Fazle Hasan Abed Scholarship",
        "Other programme-specific scholarships",
      ],
    },
    officialLinks: {
      tuition: "https://www.bracu.ac.bd/admissions/tuition-and-fees",
      scholarships: "https://www.bracu.ac.bd/admissions/scholarships-and-financial-aid",
      admission: "https://www.bracu.ac.bd/admissions",
    },
    dataNote: "The listed per-credit rate is for most programmes; confirm the rate for your chosen degree.",
  },
  {
    id: "iut",
    name: "Islamic University of Technology",
    shortName: "IUT",
    country: "Bangladesh",
    city: "Gazipur",
    type: "Public",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Engineering", "Computer Science", "Business"],
    description:
      "An international university of engineering and technology located in Gazipur.",
    website: "https://www.iutoic-dhaka.edu",
    budget: {
      amount: 20100,
      currency: "USD",
      period: "4-year programme",
      summary:
        "Published self-financed residential undergraduate cost: approximately USD 20,100 over four years. Non-residential self-financed cost: approximately USD 14,100.",
    },
    scholarships: {
      summary:
        "IUT offers full and partial OIC scholarships to eligible nominated students. Host-country students may also qualify for certain partial scholarships based on admission merit.",
      opportunities: [
        "Full OIC scholarship",
        "Partial OIC scholarship",
        "IUT conditional partial scholarship",
      ],
    },
    officialLinks: {
      tuition: "https://admission.iutoic-dhaka.edu/information/payment-fees",
      scholarships: "https://admission.iutoic-dhaka.edu/information/scholarship",
      admission: "https://admission.iutoic-dhaka.edu",
    },
    dataNote:
      "Published fee figures distinguish residential and non-residential students. Scholarship eligibility and nomination rules are important.",
  },
  {
    id: "iub",
    name: "Independent University, Bangladesh",
    shortName: "IUB",
    country: "Bangladesh",
    city: "Dhaka",
    type: "Private",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Computer Science", "Business", "Engineering", "Environmental Science"],
    description:
      "A private university offering a variety of undergraduate and postgraduate programs.",
    website: "https://www.iub.edu.bd",
    budget: {
      amount: null,
      currency: "BDT",
      period: "Programme-dependent",
      summary:
        "Tuition depends on the selected programme and credit requirements. Check the university's current fee information before estimating the total cost.",
    },
    scholarships: {
      summary:
        "IUB has published merit scholarships, need-based financial aid and tuition discounts. The applicable percentages and eligibility conditions must be confirmed with the current policy.",
      opportunities: [
        "Admission-test merit discount",
        "Semester-result merit scholarship",
        "Need-based financial aid",
        "Extracurricular activity scholarship",
      ],
    },
    officialLinks: {
      tuition: "https://www.iub.edu.bd",
      scholarships: "https://www.iub.edu.bd",
      admission: "https://www.iub.edu.bd",
    },
    dataNote:
      "A current official fee schedule and scholarship policy page should be confirmed before displaying specific amounts or percentages.",
  },
  {
    id: "aiub",
    name: "American International University-Bangladesh",
    shortName: "AIUB",
    country: "Bangladesh",
    city: "Dhaka",
    type: "Private",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Computer Science", "Engineering", "Business"],
    description:
      "A private university with academic programs in computing, engineering, and business.",
    website: "https://www.aiub.edu",
    budget: {
      amount: 8500,
      currency: "BDT",
      period: "Per credit",
      summary:
        "CSE tuition is listed at Tk 8,500 per credit for incoming students under the published Fall 2026–27 fee schedule. Other programmes have different rates.",
    },
    scholarships: {
      summary:
        "Offers merit-based scholarships, academic scholarships, extracurricular scholarships and need-based financial aid.",
      opportunities: [
        "Freshman merit scholarship",
        "Academic scholarship for regular students",
        "Need-based tuition fee waiver",
        "Sports and extracurricular scholarships",
        "Other financial-aid schemes",
      ],
    },
    officialLinks: {
      tuition: "https://grants.aiub.edu/tuition-fee",
      scholarships: "https://english.aiub.edu/admission/scholarships",
      admission: "https://www.aiub.edu/admission",
    },
    dataNote:
      "The displayed per-credit figure is specifically for CSE, not every undergraduate programme.",
  },
  {
    id: "ubc",
    name: "University of British Columbia",
    shortName: "UBC",
    country: "Canada",
    city: "Vancouver",
    type: "Public",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Computer Science", "Engineering", "Business", "Science", "Arts"],
    description:
      "A public research university in British Columbia, Canada.",
    website: "https://www.ubc.ca",
    budget: {
      amount: 49549,
      currency: "CAD",
      period: "Estimated first year",
      studentCategory: "International",
      summary:
        "UBC's published 2026 student guide gives an indicative international tuition figure of CAD 49,549+ for a full first-year course load, based on 2024/25 figures. Actual fees vary by programme and year.",
    },
    scholarships: {
      summary:
        "International students may apply for merit-based and need-based awards through programmes such as the International Scholars Program. Eligibility is highly competitive.",
      opportunities: [
        "International Scholars Program",
        "Karen McKellin International Leader of Tomorrow Award",
        "Donald A. Wehrung International Student Award",
      ],
    },
    officialLinks: {
      tuition: "https://you.ubc.ca/financial-planning/tuition-fees/",
      scholarships: "https://you.ubc.ca/financial-planning/scholarships-awards-international-students/",
      admission: "https://you.ubc.ca/applying-ubc/",
    },
    dataNote:
      "The tuition figure is an indicative older academic-year estimate, not a guaranteed 2026/27 fee. Use UBC's cost estimator for a current programme-specific amount.",
  },
  {
    id: "utoronto",
    name: "University of Toronto",
    shortName: "U of T",
    country: "Canada",
    city: "Toronto",
    type: "Public",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Computer Science", "Engineering", "Business", "Science", "Arts"],
    description:
      "A public research university based in Toronto, Canada.",
    website: "https://www.utoronto.ca",
    budget: {
      amount: null,
      currency: "CAD",
      period: "Programme-dependent",
      studentCategory: "International",
      summary:
        "International undergraduate tuition varies by programme, campus and course load. Incidental fees, health insurance and living expenses are additional.",
    },
    scholarships: {
      summary:
        "The Lester B. Pearson International Scholarship is a highly competitive award for exceptional international undergraduate applicants. It covers tuition, books, incidental fees and residence support for four years.",
      opportunities: [
        "Lester B. Pearson International Scholarship",
        "Admission scholarships",
        "In-course scholarships",
      ],
    },
    officialLinks: {
      tuition: "https://future.utoronto.ca/fees",
      scholarships: "https://future.utoronto.ca/scholarships-international-students",
      admission: "https://future.utoronto.ca",
    },
    dataNote:
      "Exact international tuition must be checked against the selected programme and campus.",
  },
  {
    id: "nus",
    name: "National University of Singapore",
    shortName: "NUS",
    country: "Singapore",
    city: "Singapore",
    type: "Public",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Computer Science", "Engineering", "Business", "Science"],
    description:
      "A public research university in Singapore.",
    website: "https://www.nus.edu.sg",
    budget: {
      amount: null,
      currency: "SGD",
      period: "Programme-dependent",
      studentCategory: "International",
      summary:
        "Tuition varies by programme and nationality. Eligible international students may apply for the MOE Tuition Grant, which reduces tuition but includes a service obligation.",
    },
    scholarships: {
      summary:
        "NUS offers international undergraduate scholarships, including the NUS International Undergraduate Scholarship. Eligibility and benefits depend on the award.",
      opportunities: [
        "NUS International Undergraduate Scholarship",
        "Science & Technology Undergraduate Scholarship",
        "Other faculty and donor-funded scholarships",
      ],
    },
    officialLinks: {
      tuition: "https://nus.edu.sg/registrar/administrative-policies-procedures/undergraduate/undergraduate-fees",
      scholarships: "https://www.nus.edu.sg/oam/scholarships/scholarships-for-freshmen-international-students",
      admission: "https://nus.edu.sg/oam",
    },
    dataNote:
      "Check the tuition category and service obligation before comparing NUS costs with other universities.",
  },
  {
    id: "melbourne",
    name: "University of Melbourne",
    shortName: "UniMelb",
    country: "Australia",
    city: "Melbourne",
    type: "Public",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Computer Science", "Engineering", "Business", "Arts", "Science"],
    description:
      "A public research university located in Melbourne, Australia.",
    website: "https://www.unimelb.edu.au",
    budget: {
      amount: null,
      currency: "AUD",
      period: "Programme-dependent",
      studentCategory: "International",
      summary:
        "International undergraduate tuition depends on the subjects and study load. Course pages provide estimated annual and total fees.",
    },
    scholarships: {
      summary:
        "International undergraduate applicants may be considered for scholarships such as the Melbourne International Undergraduate Scholarship. Some awards are assessed automatically after applying.",
      opportunities: [
        "Melbourne International Undergraduate Scholarship",
        "Melbourne International Excellence Scholarship",
        "Other international scholarships and bursaries",
      ],
    },
    officialLinks: {
      tuition: "https://study.unimelb.edu.au/how-to-apply/undergraduate-study/international-applications/fees-and-payments",
      scholarships: "https://study.unimelb.edu.au/study-with-us/international-scholarships",
      admission: "https://study.unimelb.edu.au/how-to-apply/undergraduate-study/international-applications",
    },
    dataNote:
      "Tuition is subject-based and can change with study load. Check the selected course page for the current estimate.",
  },
  {
    id: "manchester",
    name: "University of Manchester",
    shortName: "UoM",
    country: "United Kingdom",
    city: "Manchester",
    type: "Public",
    levels: ["Undergraduate", "Postgraduate"],
    subjects: ["Computer Science", "Engineering", "Business", "Science", "Arts"],
    description:
      "A public research university located in Manchester, United Kingdom.",
    website: "https://www.manchester.ac.uk",
    budget: {
      amount: null,
      currency: "GBP",
      period: "Programme-dependent",
      studentCategory: "International",
      summary:
        "International tuition fees are published on individual course pages and vary by programme. The university may increase fees in later academic years.",
    },
    scholarships: {
      summary:
        "The Global Futures Scholarships include awards for eligible South Asian students, including applicants domiciled in Bangladesh. Undergraduate awards may provide tuition-fee discounts.",
      opportunities: [
        "Global Futures Scholarships",
        "South Asia undergraduate scholarships",
        "Other international scholarships",
      ],
    },
    officialLinks: {
      tuition: "https://www.manchester.ac.uk/study/international/finance-and-scholarships/fees/",
      scholarships: "https://www.manchester.ac.uk/study/international/country-specific-information/bangladesh/scholarships/",
      admission: "https://www.manchester.ac.uk/study/international/",
    },
    dataNote:
      "Scholarship availability and value depend on entry year and eligibility. Check the current Bangladesh-specific scholarship page.",
  },
];

export default universities;
