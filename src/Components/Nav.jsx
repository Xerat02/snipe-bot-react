import { useState } from "react";
import { Link } from "react-router-dom";

function Menu() {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm rounded-lg mt-2">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <Link to="/">Home</Link>
              <li>
                <Link to="/snipes">Snipes</Link>
              </li>
              <li>
                <Link to="/stats">Stats</Link>
              </li>
              <li>
                <Link to="/servers">Servers</Link>
              </li>
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost normal-case text-lg lg:text-xl">
            Snipebot
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/snipes">Snipes</Link>
            </li>
            <li>
              <Link to="/stats">Stats</Link>
            </li>
            <li>
              <Link to="/servers">Servers</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link to="/Snipes" className="btn btn-primary">
            Start sniping now
          </Link>
        </div>
      </div>
    </>
  );
}
export default Menu;
