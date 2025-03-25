import FAQ from './FAQ';

const FAQSection = () => {
  // Sample FAQ data
  const faqItems = [
    {
      question: "What are we known for?",
      answer: "We're best known for our authentic Thai cuisine, especially our pad thai and tom yum soup. All our dishes are made with fresh, locally-sourced ingredients whenever possible, and we pride ourselves on balancing traditional recipes with modern culinary techniques."
    },
    {
      question: "What meals do you serve?",
      answer: "We serve breakfast, lunch, and dinner. Our breakfast menu is available from 7am-11am, lunch from 11am-3pm, and dinner from 5pm-10pm. We also offer a special brunch menu on weekends from 9am-2pm."
    },
    {
      question: "Do you offer delivery or takeout?",
      answer: "Yes, we offer both delivery and takeout options. You can place orders through our website, mobile app, or by calling us directly. Delivery is available within a 5-mile radius of our restaurant, and takeout orders can be picked up at our dedicated counter."
    },
    {
      question: "Where are you located?",
      answer: "Our main restaurant is located at 123 Main Street, Downtown, with additional locations in Westside Mall and North Hills. Each location has convenient parking and is accessible by public transportation."
    },
    {
      question: "What areas do you serve?",
      answer: "We currently deliver to Downtown, Midtown, Westside, and North Hills areas. For catering services, we cover the entire metropolitan area with advance booking."
    }
  ];

  return (
    <div className="">
      <FAQ faqItems={faqItems} />
    </div>
  );
};

export default FAQSection;