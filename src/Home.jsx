import { Link } from "react-router-dom";
import heroImage from "/src/assets/hero_image.png";

function Home() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={heroImage} className="w-full lg:max-w-sm" />
        <div>
          <h1 className="text-2xl lg:text-5xl font-bold">
            Make MONEY by buying CS2 skins
          </h1>
          <p className="text-sm lg:text-lg py-6">
            Our snipebot scans thousands of offers across markets for you and
            shows you the best and most attractive deals
          </p>
          <Link to="/Snipes" className="btn btn-primary">
            Start sniping now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
