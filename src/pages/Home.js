import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { /*faFacebook, */ faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Home = () => 
  
  
  {
    return (
      <div className="home">
      
        <div className="about_me">
          <h1>WELCOME</h1>
          <p>My name is Jakub, I'm' a software engineer. </p>
          <p>I work as a .Net developer in a company producing ERP systems.</p>
          <p>This is my personal website where I host my web applications and data.</p>
          <p>On this web you can use the BDD diagrams generator application that I created for my engineering thesis defense.</p>
          <p>I'm also working on a web service for store SQL queries.</p>
          <p>As a fan of 3D printing, I will try to share my knowledge and maybe some 3D projects.</p>
          <p></p>
          <p>I'm still working on the look and functionality of this website, so please keep that in mind.</p>
        </div>
        <div>
          {// eslint-disable-next-line
           }
          {/* <a href="#"><FontAwesomeIcon className="social_m_icon" icon={faFacebook}></FontAwesomeIcon></a> */}
          <a href="https://www.linkedin.com/in/jakub-b%C5%82aszyk-487266156/"><FontAwesomeIcon className="social_m_icon"icon={faLinkedin}></FontAwesomeIcon></a>
          
        </div>

      </div>
    )    
       
  };
  
  export default Home;