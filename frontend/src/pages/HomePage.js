import React, { useEffect, useRef, useState } from "react";
import bigLogo from "../assets/BB_Logo_Horizontal_COLOR_1.png";
import AnimeList from "../components/animeCards/AnimeList";
import ForgotPassword from "../components/loginAndRegister/ForgotPassword";
import LoginForm from "../components/loginAndRegister/LoginForm";
import SignUpForm from "../components/loginAndRegister/SignUpForm";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [search, setSearch] = useState();
  const [animeData, setAnimeData] = useState();
  const [currentForm, setCurrentForm] = useState("");
  const animeRowRef = useRef(null);
  const [showVerificationBar, setShowVerificationBar] = useState(false);
  const [showEasterEggHiddenLink, setshowEasterEggHiddenLink] = useState(true);

  // gets the animes to display in sidebar, 24 is to make it flush since in 3 by 3 grid
  const getData = async () => {
    const res = await fetch(
      `https://api.jikan.moe/v4/seasons/2024/spring?limit=24&genres_excluded=9,45,12`
    );
    const resData = await res.json();
    setAnimeData(resData.data);
  };

  useEffect(() => {
    getData();
  }, [search]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (animeRowRef.current) {
        const maxScroll =
          animeRowRef.current.scrollHeight - animeRowRef.current.clientHeight;
        if (animeRowRef.current.scrollTop < maxScroll) {
          animeRowRef.current.scrollBy(0, 1);
        } else {
          animeRowRef.current.scrollTop = 0; // Reset scroll to top when it reaches the bottom
        }
      }
    }, 50); // Speed of scroll - lower is faster. Adjust as needed.

    return () => clearInterval(interval);
  }, []);

  const handleSwitchForm = (formType) => {
    setCurrentForm(formType);
    setShowVerificationBar(false);
    setshowEasterEggHiddenLink(false);
  };

  const handleCloseForms = () => {
    setCurrentForm("");
    setshowEasterEggHiddenLink(true);
  };

  return (
    <>
      <div className="topbarHomePage topbar">
        <Link to="/about-us">
          <button className="about-us-button">About Us</button>
        </Link>
      </div>
      {showVerificationBar && (
        <div className="verification-bar">
          <p>
            Email Verification Sent: Please Check Email to Verify Account and Be
            Able To Login!
          </p>
        </div>
      )}
      <div className="container">
        <div className="anime-row" ref={animeRowRef}>
          <div className="row">
            <AnimeList animelist={animeData} />
          </div>
        </div>
        <div className="logo-and-form-container">
          {currentForm === "" && (
            <div className="logo-container">
              <img src={bigLogo} alt="Big Logo" />
              <div className="buttons">
                <button
                  className="button"
                  onClick={() => handleSwitchForm("login")}
                >
                  Login
                </button>
                <button
                  className="button"
                  onClick={() => handleSwitchForm("signup")}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
          {currentForm === "login" && (
            <LoginForm
              onClose={handleCloseForms}
              onSwitchForm={handleSwitchForm}
              onShowForgotPassword={() => handleSwitchForm("forgot")}
            />
          )}
          {currentForm === "signup" && (
            <SignUpForm
              onClose={handleCloseForms}
              onSwitchBack={() => handleSwitchForm("login")}
              setShowVerificationBar={setShowVerificationBar}
            />
          )}
          {currentForm === "forgot" && (
            <ForgotPassword
              onClose={handleCloseForms}
              onSwitchForm={() => handleSwitchForm("login")}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
