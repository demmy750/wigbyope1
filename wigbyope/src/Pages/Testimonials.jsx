// import React from "react";
// import "./Testimonials.css";

// const testimonials = [
//   {
//     id: 1,
//     name: "Sophia M.",
//     location: "New York, NY",
//     feedback:
//       "I absolutely love my new wig! The quality is outstanding and the styling training helped me feel confident every day. Highly recommend!",
//     avatar: "https://randomuser.me/api/portraits/women/65.jpg",
//   },
//   {
//     id: 2,
//     name: "Jasmine L.",
//     location: "Los Angeles, CA",
//     feedback:
//       "The team was so professional and attentive. My wig looks natural and feels so comfortable. The customer service made all the difference.",
//     avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//   },
//   {
//     id: 3,
//     name: "Maya R.",
//     location: "Chicago, IL",
//     feedback:
//       "I was nervous about wearing a wig, but their expert styling training gave me the confidence to rock my look. The wig quality is top-notch!",
//     avatar: "https://randomuser.me/api/portraits/women/22.jpg",
//   },
// ];

// const Testimonials = () => (
//   <section
//     className="testimonials"
//     aria-labelledby="testimonials-heading"
//     role="region"
//   >
//     <div className="container">
//       <h2 id="testimonials-heading" tabIndex="0" className="testimonials-title">
//         ⭐ Client Testimonials
//       </h2>
//       <p className="testimonials-subtitle">
//         Hear from our satisfied clients who trust us for premium wigs and expert styling.
//       </p>
//       <ul className="testimonial-list">
//         {testimonials.map(({ id, name, location, feedback, avatar }) => (
//           <li
//             key={id}
//             className="testimonial-card"
//             tabIndex="0"
//             aria-label={`Testimonial from ${name} from ${location}`}
//           >
//             <img
//               src={avatar}
//               alt={`Photo of ${name}`}
//               className="testimonial-avatar"
//               loading="lazy"
//             />
//             <blockquote className="testimonial-feedback">“{feedback}”</blockquote>
//             <p className="testimonial-name">{name}</p>
//             <p className="testimonial-location">{location}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </section>
// );

// export default Testimonials;











//npm install react-slick slick-carousel



import React from "react";
import Slider from "react-slick";
import "./Testimonials.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    id: 1,
    name: "Sophia M.",
    location: "New York, NY",
    feedback:
      "I absolutely love my new wig! The quality is outstanding and the styling training helped me feel confident every day. Highly recommend!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 2,
    name: "Jasmine L.",
    location: "Los Angeles, CA",
    feedback:
      "The team was so professional and attentive. My wig looks natural and feels so comfortable. The customer service made all the difference.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Maya R.",
    location: "Chicago, IL",
    feedback:
      "I was nervous about wearing a wig, but their expert styling training gave me the confidence to rock my look. The wig quality is top-notch!",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <section className="testimonials" aria-labelledby="testimonials-heading">
      <div className="container">
        <h2 id="testimonials-heading" className="testimonials-title">
          ⭐ Client Testimonials
        </h2>
        <p className="testimonials-subtitle">
          Hear from our satisfied clients who trust us for premium wigs and expert styling.
        </p>
        <Slider {...settings}>
          {testimonials.map(({ id, name, location, feedback, avatar }) => (
            <div key={id}>
              <div
                className="testimonial-card"
                tabIndex="0"
                aria-label={`Testimonial from ${name} from ${location}`}
              >
                <img
                  src={avatar}
                  alt={`Photo of ${name}`}
                  className="testimonial-avatar"
                  loading="lazy"
                />
                <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                <blockquote className="testimonial-feedback">“{feedback}”</blockquote>
                <p className="testimonial-name">{name}</p>
                <p className="testimonial-location">{location}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
