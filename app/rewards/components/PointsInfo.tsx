interface BenefitCardProps {
  title: string;
  description: string;
}

function BenefitCard({ title, description }: BenefitCardProps) {
  return (
    <div className="bg-white rounded-[30px] p-3.5 flex flex-col gap-5 flex-1 items-center">
      <div className="bg-light-gold rounded-full px-6 py-3 w-full flex items-center justify-center">
        <span className="font-poppins-bold text-xl text-dark-sage text-center">
          {title}
        </span>
      </div>
      <p className="font-poppins-regular text-lg text-center">{description}</p>
    </div>
  );
}

export default function PointsInfo() {
  return (
    <div className="bg-parchment border border-sage rounded-[50px] py-2.5 flex flex-col gap-2.5">
      {/* It's Simple */}
      <div className="flex flex-col items-center justify-center gap-7 px-10 py-12">
        <h2 className="font-poppins-bold text-display text-dark-green text-center">
          It&apos;s Simple
        </h2>
        <div className="bg-light-gold rounded-full px-2.5 py-5 w-full max-w-xl flex items-center justify-center">
          <span className="font-poppins-bold text-5xl text-dark-green uppercase text-center">
            $1 Spent = 1 point
          </span>
        </div>
        <p className="font-poppins-regular text-lg text-dark-green text-center max-w-lg">
          Points add up automatically when you use your phone number or email at
          checkout. You must be subscribed to our marketing communications to be
          in the Garden Club.
        </p>
      </div>

      {/* Using Points */}
      <div className="flex flex-col items-center justify-center gap-4 px-9 py-10">
        <h2 className="font-poppins-bold text-display text-dark-green text-center">
          Using Points
        </h2>
        <div className="flex gap-2.5 w-full">
          <div className="bg-white rounded-[40px] px-5 py-6 flex items-center flex-1">
            <p className="font-poppins-bold text-2xl text-orange-glow text-center flex-1">
              100 points = $3 off any purchase
            </p>
          </div>
          <div className="bg-white rounded-[40px] px-5 py-6 flex items-center flex-1">
            <p className="font-poppins-bold text-2xl text-orange-glow text-center flex-1">
              75 points = $5 off any Sweetleaves edible
            </p>
          </div>
        </div>
      </div>

      {/* What You Get */}
      <div className="flex flex-col items-start gap-9 px-10 py-10">
        <h2 className="font-poppins-bold text-display text-dark-green text-center w-full">
          What You Get
        </h2>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-2.5">
            <BenefitCard
              title="Double Points Days"
              description="Members will be included in exclusive double points days, we'll text or email you when it's happening."
            />
            <BenefitCard
              title="Birthday Reward"
              description="Complimentary Edible. Redeemable for 5 days before and after your birthday."
            />
          </div>
          <div className="flex gap-2.5">
            <BenefitCard
              title="Early Access"
              description="Get first dibs when new products drop or popular items restock. Members hear first."
            />
            <BenefitCard
              title="Quarterly Giveaways"
              description="Any Garden Club member who spends over $X per month is automatically entered to win tickets to local events like concerts, sports games, and shows."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
