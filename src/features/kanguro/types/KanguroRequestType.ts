export type KanguroRequestType = {
  pets: [
    {
      name: string;
      type: "Dog" | "Cat";
      birthday: string; // e.g."2020-01-31"; //14 years max
      breedId: number;
      gender: "Male" | "Female";
      coverage: {
        deductible: 200 | 500 | 700 | 1000;
        reimbursementRate: 70 | 80 | 90;
        annualLimit:
          | "Unlimited"
          | "5000"
          | "8000"
          | "10000"
          | "15000"
          | "20000"
          | "30000";
      };
    }
  ];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string; // 10 digit string format e.g. "1234567890"
    zipCode: string; // 5 digit string format e.g. "12345"
  };
  marketing: {
    utm_campaign: "example_tracking_id";
  };
  coverage: {
    invoiceInterval: "MONTHLY";
  };
};
