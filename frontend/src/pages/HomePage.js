import React, { useEffect, useRef, useState } from "react";
import bigLogo from "../assets/BB_Logo_Horizontal_COLOR_1.png";
import AnimeList from "../components/animeCards/AnimeList";
import ForgotPassword from "../components/loginAndRegister/ForgotPassword";
import LoginForm from "../components/loginAndRegister/LoginForm";
import SignUpForm from "../components/loginAndRegister/SignUpForm";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { useLocation } from "react-router";

const HomePage = () => {
  const [search, setSearch] = useState();
  const [animeData, setAnimeData] = useState();
  const [currentForm, setCurrentForm] = useState("");
  const animeRowRef = useRef(null);
  const [showVerificationBar, setShowVerificationBar] = useState(false);
  const [showResetBar, setShowResetBar] = useState(false);
  const [showEmailVerifiedBar, setShowEmailVerifiedBar] = useState(false);
  const [showPasswordResetBar, setShowPasswordResetBar] = useState(false);
  const [showDeleteAccountBar, setShowDeleteAccountBar] = useState(false);
  const location = useLocation();

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
        animeRowRef.current.scrollTop += 1;
        if (animeRowRef.current.scrollTop >= animeRowRef.current.scrollHeight - animeRowRef.current.clientHeight) {
          animeRowRef.current.scrollTop = 0;
        }
      }
    }, 50); // Speed of scroll - lower is faster. Adjust as needed.

    return () => clearInterval(interval);
  }, []);

  const handleSwitchForm = (formType) => {
    setCurrentForm(formType);
  };

  useEffect(() => {
    handleResetBars();
  }, [currentForm]);

  const handleResetBars = () => {
    setShowVerificationBar(false);
    setShowResetBar(false);
    setShowEmailVerifiedBar(false);
    setShowPasswordResetBar(false);
    setShowDeleteAccountBar(false);
  };

  const handleCloseForms = () => {
    setCurrentForm("");
  };

  const TopNavbar = styled.nav`
    background-color: #111920; 
  `;

  const CustomPrimaryButton = styled.button`
    background-color: #111920;
    border: none;
    transition: all 0.3s ease;

    &:hover,
    &:focus {
      border: 2px solid white;
      transform: scale(1.05);
    }
  `;

  const CustomLink = styled.div`
    border: none;
    transition: all 0.3s ease;

    &:hover,
    &:focus {
      border: 2px solid white;
      transform: scale(1.05);
    }
  `;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'verified') {
      setShowEmailVerifiedBar(true);
    } else if (params.get('action') === 'reset') {
      setShowPasswordResetBar(true);
    } else if (params.get('action') === 'delete') {
      setShowDeleteAccountBar(true);
    } else if (params.get('action') === 'signup') {
      setShowVerificationBar(true);
    } else if (params.get('action') === 'forgot') {
      setShowResetBar(true);
    }

  }, [location.search]);

  return (
    <>
      <TopNavbar className="navbar navbar-expand-lg navbar-dark d-flex justify-content-between p-2">
        <Link to="/" className="navbar-brand">
          <img src={bigLogo} alt="Big Logo" className="logo img-fluid mr-3" style={{ minHeight: '50px', maxHeight: '50px' }} />
        </Link>
        <div className="navbar-brand ml-auto">
          <CustomLink className="nav-link p-2" >
            <Link className="text-white text-decoration-none" to="/about-us"><strong>About Us</strong></Link>
          </CustomLink>
        </div>
      </TopNavbar>
      <div style={{ background: "linear-gradient(to left, #2e77AE, #000000)" }}>
        {showVerificationBar && (
          <div className="verification-bar bg-success text-white p-2">
            <p className="m-0 text-center">
              Email Verification Sent: Please Check Email to Verify Account and Be
              Able To Login!
            </p>
          </div>
        )}
        {showResetBar && (
          <div className="verification-bar bg-success text-white p-2">
            <p className="m-0 text-center">
              Password Reset Email Sent: Please Check Email to Reset Password and Be
              Able To Login!
            </p>
          </div>
        )}
        {showEmailVerifiedBar && (
          <div className="verification-bar bg-success text-white p-2">
            <p className="m-0 text-center">
              Email Successfully Verified: Please Login!
            </p>
          </div>
        )}
        {showPasswordResetBar && (
          <div className="verification-bar bg-success text-white p-2">
            <p className="m-0 text-center">
              Password Successfully Changed: Please Login With New Password!
            </p>
          </div>
        )}
        {showDeleteAccountBar && (
          <div className="verification-bar bg-success text-white p-2">
            <p className="m-0 text-center">
              Account Deleted Successfully: Please Create An Account to Get Back in!
            </p>
          </div>
        )}
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="anime-row overflow-hidden" style={{ minHeight: "92.4vh", maxHeight: "200px", overflowY: "scroll" }} ref={animeRowRef}>
                <div className="row">
                  <AnimeList animelist={animeData} />
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-center justify-content-center">
              <div className="logo-and-form-container">
                {currentForm === "" && (
                  <div className="logo-container text-center">
                    <img src={bigLogo} alt="Big Logo" className="img-fluid mb-4" style={{ maxWidth: "100%", height: "auto", width: "500px" }} />
                    <div className="buttons p-4 d-flex justify-content-center">
                      <CustomPrimaryButton
                        className="btn btn-secondary btn-lg btn-common" 
                        onClick={() => handleSwitchForm("login")}
                      >
                        Login
                      </CustomPrimaryButton>
                      <div className="p-2"></div>
                      <CustomPrimaryButton
                        className="btn btn-secondary btn-lg btn-common" 
                        onClick={() => handleSwitchForm("signup")}
                      >
                        Sign Up
                      </CustomPrimaryButton>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
