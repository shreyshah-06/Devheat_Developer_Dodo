import React from 'react';

function Footer() {
  function handleClick() {
    window.location.href = 'register';
  }

  return (
    <>
      <div className="footer section__padding" style={{ marginTop: '7vh' }}>
        <div className="footer-links" style={{ borderTop: '1px solid white' }}>
          <div className="footer-links_logo">
            <p>Indian Institute of Information Technology, Surat. <br /> <br /> Devheat 2022</p>
          </div>
          <div className="footer-links_div">
            <h4>Follow us</h4>
            <p>Github</p>
            <p>Social Media</p>
            <p>Contact</p>
          </div>
          <div className="footer-links_div">
            <h4>Company</h4>
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
            <p>Contact</p>
          </div>
          <div className="footer-links_div">
            <h4>Get in touch</h4>
            <p>Company name</p>
            <p>Linkedin</p>
            <p>info@payme.net</p>
          </div>
        </div>

        <div className="footer-copyright">
          <p>@2022 Developer_Dodo. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}

export default Footer;
