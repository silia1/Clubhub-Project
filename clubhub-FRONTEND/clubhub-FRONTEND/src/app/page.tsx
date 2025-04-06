"use client";
import Image from "next/image";
import Link from "next/link";
import "./globals.css"; // Importing the global CSS

export default function Home() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <Link href="/">Home</Link>
          <Link href="#about-us">About</Link>
          <Link href="#clubs">Clubs</Link>
          <Link href="#gallery">Gallery</Link>
          <Link href="#testimonials">Testimonials</Link>
          <Link href="#contact">Contact Us</Link>
          <Link href="/sign-in" className="signin-btn">Sign In</Link>
        </nav>
      </header>

      {/* Main Section */}
      <section className="main-banner">
        <div className="text-container">
          <h1>Top Clubs for Your Growth</h1>
          <p>Unlock Your Potential in ENSA’s Student Life</p>
          <div className="buttons">
            <Link href="#clubs" className="btn-primary">Our Clubs</Link>
            <Link href="/sign-up" className="btn-secondary">Join a Club</Link>
          </div>
        </div>
        <div className="image-container">
          <Image
            src="/images_main/mainpage.png"
            alt="Student"
            width={500}
            height={500}
          />
        </div>
      </section>

      {/* About Us */}
<section id="about-us" className="about-us">
  <Image src="/signup/Green and Black Minimalist Education Logo.png" alt="About Us" width={300} height={300} />
  
  <div>
    <h2>About Us</h2>
    <p>
      This platform is designed to make it easy for students to explore the variety of clubs at ENSA, join the ones that match their interests, and stay updated with all their activities. Our mission is to simplify the process of joining and participating in club events, projects, and discussions, ensuring that every student can fully engage in their university experience.
    </p>
    <Link href="/about" className="btn-read-more">Read More</Link>
  </div>
</section>


      {/* Featured Clubs */}
<section id="clubs" className="featured-clubs">
  <div className="club">
    <Image src="/images_main/club1.png" alt="Club 1" width={100} height={100} />
    <h3>Club Musical</h3>
    <div className="quote">“</div>
    <p className="description">
      The ensa music club brings together students passionate about singing, composing, and playing instruments. We organize jam sessions, concerts, and collaborate on musical projects.
    </p>
  </div>
  
  <div className="club">
    <Image src="/images_main/club2.png" alt="Club 2" width={100} height={100} />
    <h3>Ensat Press</h3>
    <div className="quote">“</div>
    <p className="description">
      The press club allows students to explore journalism, article writing, and cover university events. We create content to inform, inspire, and give a voice to the student community.
    </p>
  </div>
  
  <div className="club">
    <Image src="/images_main/club3.png" alt="Club 3" width={100} height={100} />
    <h3>CDH</h3>
    <div className="quote">“</div>
    <p className="description">
      The human rights club is dedicated to raising awareness and advocating for human rights. We organize debates, conferences, and projects to promote equality and justice at ENSA and beyond.
    </p>
  </div>
</section>


      {/* Gallery */}
      <section id="gallery" className="gallery">
        <h2>Gallery</h2>
        <div className="gallery-grid">
          <Image src="/images/gallery1.png" alt="Gallery 1" width={300} height={300} />
          <Image src="/images/gallery2.png" alt="Gallery 2" width={300} height={300} />
          <Image src="/images/gallery3.png" alt="Gallery 3" width={300} height={300} />
        </div>
        <Link href="/gallery" className="btn-more">More</Link>
      </section>

      {/* Testimonials */}
<section id="testimonials" className="testimonials">
  <h2>Testimonials</h2>
  <div className="testimonial-grid">
    <div className="testimonial">
      <p>"ENSA has given me incredible opportunities to grow both personally and professionally."</p>
      <h4>Lamia, ENSA Student</h4>
    </div>
    <div className="testimonial">
      <p>"Being a Club President has helped me develop leadership skills and connect with students."</p>
      <h4>Sarah, Club President</h4>
    </div>
  </div>
</section>


{/* Contact Us */}
<section id="contact" className="contact">
  <h2>Contact Us</h2>
  <div className="contact-container">
    <form className="contact-form">
      <label>
        Name
        <input type="text" placeholder="Your Name" required />
      </label>
      <label>
        Email Address
        <input type="email" placeholder="Your Email" required />
      </label>
      <label>
        Your Message
        <textarea placeholder="Your Message" required></textarea>
      </label>
      <button type="submit" className="btn-send">Send</button>
    </form>
    <div className="contact-info">
      <p>
        <i className="fas fa-map-marker-alt"></i> Information technologies building, Chandlodiya, Ahmedabad.
      </p>
      <p>
        <i className="fas fa-phone"></i> +234 081-1236-1234
      </p>
      <p>
        <i className="fas fa-envelope"></i> hp@info.com
      </p>
      <div className="social-icons">
        <a href="#"><i className="fab fa-youtube"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-facebook"></i></a>
      </div>
      <div className="map">
        {/* Embed Google Maps iframe here */}
        <iframe src="https://www.google.com/maps/embed" width="300" height="200"></iframe>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="footer">
  <div className="footerContent">
    {/* Left side: Logo */}
    <div className="footerLogo">
      <img src="/signup/Green and Black Minimalist Education Logo.png" alt="Logo" className="logo" />
    </div>

    {/* Center: Quick Links and Other Links */}
    <div className="footerLinks">
      <div>
        <h4>Quick Links</h4>
        <a href="#contact">Contact Us</a>
        <a href="#about-us">About Us</a>
      </div>
      <div>
        <h4>Others</h4>
        <a href="#">User FAQs</a>
        <a href="#">Legal</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms and Conditions</a>
      </div>
    </div>

    {/* Right Side: Social Media & Newsletter */}
    <div className="footerRight">
      <div className="socialMedia">
        <h4>Follow us</h4>
        <div className="socialIcons">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <img src="/signup/facebook.jpg" alt="Facebook" className="socialIcon" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <img src="/signup/twitter.jpg" alt="Twitter" className="socialIcon" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <img src="/signup/insta.jpg" alt="Instagram" className="socialIcon" />
          </a>
        </div>
      </div>
      <div className="newsletter">
        <h4>Subscribe to our newsletter</h4>
        <input type="email" placeholder="Email Address" />
        <button>Subscribe</button>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}
