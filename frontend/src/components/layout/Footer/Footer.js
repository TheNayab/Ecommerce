import React from "react";
import playStore from "../../../images/playstore.png";
import AppStore from "../../../images/Appstore.png";
import foter from "../../../images/nayab.png";
import git from "../../../images/git.png";
import insta from "../../../images/instagram.png";
import linkedin from "../../../images/linkedin.png";
import "./footer.css";
const Footer = () => {
  return (
    <>
      <footer id="footer">
        <div className="leftFooter">
          <b>
            <h4>DOWNLOAD OUR APP</h4>
          </b>
          <p>Download App for Android and IOS mobile phone</p>
          <img src={playStore} alt="playstore" />
          <img src={AppStore} alt="appstore" />
        </div>
        <div className="midFooter">
          <img src={foter} alt="" />
          <hr />
          <p className="email">
            <b> Email : </b> nayab8609@gmail.com
          </p>
          <p>High Quality is our first priority</p>
          <p>Copyrights &copy; 2022</p>
        </div>
        <div className="rightFooter">
          <h4>Follow us</h4>
          <div>
            <a href="https://www.instagram.com/i_nayabali/" target="_black">
              <img src={insta} width="40" alt="" />
            </a>
            <a href="https://www.linkedin.com/in/thenayabali/" target="_black">
              <img src={linkedin} width="40" alt="" />
            </a>
            <a href="https://github.com/TheNayab" target="_black">
              <img src={git} width="43" alt="" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
