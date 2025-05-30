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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
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
              <li>
                <button
                  onClick={() =>
                    document.getElementById("my_modal_1")?.showModal()
                  }
                >
                  About
                </button>
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
            <li>
              <button
                onClick={() =>
                  document.getElementById("my_modal_1")?.showModal()
                }
              >
                About
              </button>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link to="/Snipes" className="btn btn-primary">
            Start sniping now
          </Link>
        </div>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">About</h3>
            <div className="py-4 space-y-2">
              <div>Vytvořil: Adam Dienstbier</div>
              <div>Osobní číslo: A24B0342P</div>
              <div>
                Jedná se o uživatelské rozhraní napsané v Reactu pro bota, který
                vyhledává výhodné obchodní nabídky ze hry Counter-Strike: Global
                Offensive 2 na trzích třetích stran. Uživatel má možnost tyto
                nabídky filtrovat, zobrazit detailní informace a využít různé
                analýzy pro optimalizaci své obchodní strategie.
              </div>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Zavřít</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}
export default Menu;
