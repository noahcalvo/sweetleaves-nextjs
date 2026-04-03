import Image from "next/image";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/dir//905+N+Washington+Ave,+Minneapolis,+MN+55401/@44.9896532,-93.2826381,17z";
const APPLE_MAPS_URL = "https://maps.apple.com/?address=905+N+Washington+Ave,+Minneapolis,+MN+55401";

const HOURS = [
  "Monday: 10am-9pm",
  "Tuesday: 10am-9pm",
  "Wednesday: 10am-9pm",
  "Thursday: 10am-10pm",
  "Friday: 10am-10pm",
  "Saturday: 9am-10pm",
  "Sunday: 11am-6pm",
];

export default function FindUs() {
  return (
    <section
      id="find-us"
      className="bg-dark-sage rounded-[40px] flex flex-col-reverse lg:flex-row gap-8 lg:gap-20 items-center p-5"
    >
      <Image
        src="/about/map.png"
        alt="Sweetleaves storefront in North Loop"
        width={625}
        height={695}
        sizes="(max-width: 1024px) 100vw, 625px"
        className="rounded-[30px] object-cover w-full lg:w-[625px] h-[257px] lg:h-[695px] shrink-0"
      />
      <div className="flex flex-col gap-3 items-center lg:items-start w-full lg:w-[597px] py-5">
        <h2 className="font-poppins-bold text-3xl lg:text-display text-white leading-[0.9] text-center lg:text-left">
          Find Us in North Loop
        </h2>

        <div className="font-poppins-regular text-lg text-white text-center lg:text-left">
          <p className="font-poppins-bold">Address</p>
          <p>905 N Washington Ave, Minneapolis, MN 55401</p>
        </div>

        <div className="flex gap-5 items-end justify-center">
          <a href={APPLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            <Image
              src="/about/apple-maps.svg"
              alt="Open in Apple Maps"
              width={68}
              height={68}
            />
          </a>
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            <Image
              src="/about/google-maps.svg"
              alt="Open in Google Maps"
              width={47}
              height={68}
            />
          </a>
        </div>

        <div className="font-poppins-regular text-lg text-white text-center lg:text-left">
          <p className="font-poppins-bold">Hours</p>
          {HOURS.map((h) => (
            <p key={h}>{h}</p>
          ))}
        </div>

        <div className="font-poppins-regular text-lg text-white text-center lg:text-left">
          <p className="font-poppins-bold">Parking</p>
          <p>Street parking on Washington and 9th Ave N.</p>
          <p>TractorWorks ramp across the street (entrance on 10th Ave).</p>
          <p>Additional street parking on N 3rd Street.</p>
        </div>

        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity text-center w-full mt-2"
        >
          Get Directions
        </a>
      </div>
    </section>
  );
}
