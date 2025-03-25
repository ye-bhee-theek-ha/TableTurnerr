import {AnimatedCTAButton_LoggedIn, AnimatedCTAButton_LoggedOut} from "@/components/CTA_header_btn";
import Header from "@/components/Header";
import { AnimatedMenuButton } from "@/components/Menu_Header_btn";
import Image from "next/image";

import placeholderImg from "@/../public/Images/Product img 1.png";
import pattern from "@/../public/Svgs/BG Pattern.svg";

import ThemeButton from "@/components/ThemeBtn";
import Home_menu_section from "@/components/Home_menu_section";
import PromotionalBanner from "@/components/Home_promotional_banner";
import Reviews from "@/components/Reviews";
import FAQSection from "@/components/FAQ_section";
import LocationComponent from "@/components/OurLocation";


export default function Home() {

  const locationData = {
    title: "Beretania, Honolulu",
    subtitle: "Seasons Taiwanese Eatery",
    address: {
      street: "100 N Beretania St #109",
      city: "Honolulu",
      state: "HI",
      zip: "96817"
    },

    mapQuery: "100 N Beretania St #109, Honolulu, HI 96817",
    
    contact: {
      phone: "808-744-0272",
      email: "contact@seasonseateryhi.com"
    },

    openingTime: "11:00 AM PDT",

    actionLinkDirections: {
      text: "Get Directions",
      url: "https://maps.google.com/?q=Seasons Tiwanese Eatery, 100 N Beretania St #109, Honolulu, HI 96817"
    },

    actionLinkContact: {
      text: "Contact",
      url: "https://maps.google.com/?q=Seasons Tiwanese Eatery, 100 N Beretania St #109, Honolulu, HI 96817"
    },

    hours: [
      { day: "Monday", hours: "10:30 AM - 3:00 PM" },
      { day: "Tuesday", hours: "10:30 AM - 3:00 PM" },
      { day: "Wednesday", hours: "10:30 AM - 3:00 PM" },
      { day: "Thursday", hours: "10:30 AM - 3:00 PM" },
      { day: "Friday", hours: "10:30 AM - 3:00 PM" },
      { day: "Saturday", hours: "10:30 AM - 3:00 PM" },
      { day: "Sunday", hours: "4:30 PM - 9:00 PM" }
    ]
  };


  return (
    <div className="p-[10px]">
      <Header />

      <div className="h-[40px]" />

      {/* hero img section */}
      <div className="h-[600px] w-full overflow-hidden rounded-[36px] relative">
        <div className="p-[80px] h-full">
          <div className="text-white text-normal3 font-bold border-l-3 border-white pl-[20px]">
            Best Taiwanese food in Honolulu
          </div>

          <div className="text-white text-h1 font-medium ">
            Savor the Best
            <br />
            Taiwanese Food in
            <br />
            Honolulu –
            <br />
            Authentic and Flavorful!
          </div>

          {/* TODO make seperate component */}
          {/* <div className="rounded-[9px] min-w-[157px] min-h-[41px] w-fit overflow-hidden flex bg-primary items-center">
            <div className="text-nowrap text-normal2 font-bold text-white mx-auto h-full flex items-center justify-center">
              Order Now
            </div>
            <div className='flex justify-end m-[5px]'>
							<div className="w-[31px] h-[31px] bg-white/15 rounded-[7px] flex items-center justify-center">
								<svg className="w-6 h-6 text-white -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
								</svg>
							</div>
						</div>
          </div> */}

          <ThemeButton />

          <Image
            src={placeholderImg}
            alt="Placeholder Image"
            className="absolute top-0 left-0 w-full h-full object-cover rounded-[36px] -z-10"
          />
        </div>
      </div>

      <div className="h-[100px]" />

      {/* section 2 */}
      <div className="w-full flex items-center justify-center text-center flex-col">
        <div className="text-h2 text-black w-full">
          Try our most popular items
        </div>
        <div className="text-normal text-grey mt-[20px]">
          Treat yourself to our must-try list that has everyone talking
        </div>
        <div className="mt-[20px]">
          <ThemeButton
            text="View Full Menu"
            textClassname="pr-[8px] pl-[14px]"
          />
        </div>
      </div>

      <div className="h-[100px]" />

      {/* Menu Section */}

      <div>
        <Home_menu_section />
      </div>

      <div className="h-[100px]" />

      {/* promotion banner */}
      <div>
        <PromotionalBanner
          image="Product img 2.png"
          title="Order From Our Website"
          description="Order directly from our website to save money in fees, get faster service, earn free food via our rewards program, and support local business."
          buttonText="Order Now"
          buttonUrl="/order"
        />
      </div>

      <div className="h-[100px]" />

      {/* reviews */}
      {/* <div className="relative"
        style={{
          overflow: "hidden",
          height: '644px',
          alignSelf: "stretch",
          borderRadius: "36px",
          background: "var(--Site-Black-10, rgba(13, 13, 13, 0.10))",
        }}
      >
        <div className="absolute h-full w-full">
          <Image
            src={pattern}
            alt="bg pattern"
            fill
            className="object-cover"
          />
        </div>
        
        <div
          style={{
            display: 'flex',
            width: '',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '42px',
          }}
        >

          <div>
            <div className="text-h2 w-full text-center font-medium">
              What our customers are
              <br />
              saying
            </div>

            <div className="text-normal1 w-full text-center font-medium mt-[20px]">
              Check out our most recent reviews!
            </div>
          </div>

          



        </div>

      </div> */}
      <Reviews />

      <div className="h-[100px]" />
      {/* FAQ */}
      <FAQSection />


      <div className="h-[100px]" />
      {/* OUR LOCATION */}
      <LocationComponent
        {...locationData}
      />
      

      <div className="h-[100px]" />
      {/* FOOTER */}


    </div>
  );
}
