import React from "react";
import { FaUserGear } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

function AdminLogin() {
  return (
    <main className="adminSingup__section w-full">
      <div className="admin__wrapper w-10/12 md:w-6/12 mx-auto py-16">
        <div className="admin__content flex flex-col justify-center">
          <div className="admin__title">
            <h3 className="text-xl text-center md:text-4xl uppercase font-bold text-black-300">
              Access your Dashboard
            </h3>
          </div>
          <div className="form__container mt-4  md:mt-16 w-full md:w-3/5 mx-auto">
            <form>
              <div className="form__content font-chivo">
                <div className="email mt-8">
                  <label htmlFor="email" className="text-golden-200">
                    Email
                  </label>
                  <div className="fullname flex items-center gap-3 mt-3 bg-golden-200 py-3 px-5 rounded-sm">
                    <MdEmail className="text-2xl text-golden-600" />
                    <input
                      id="email"
                      type="email"
                      placeholder="admin@estatesindicates.com"
                      className="bg-transparent w-full focus:outline-none text-sm md:text-xl font-bold text-golden-600"
                    />
                  </div>
                </div>
                <div className="email mt-8">
                  <label htmlFor="password" className="text-golden-200">
                    Password
                  </label>
                  <div className="password flex items-center gap-3 mt-3 bg-golden-200 py-3 px-5 rounded-sm">
                    <MdPassword className="text-2xl text-golden-600" />
                    <input
                      id="password"
                      type="password"
                      placeholder="*******"
                      className="bg-transparent w-full focus:outline-none text-sm md:text-xl font-bold text-golden-600"
                    />
                  </div>
                </div>

                <button className="mt-16 bg-golden-600 w-full py-4 text-sm md:text-xl rounded-sm text-golden-900 font-bold hover:bg-golden-700">
                  Create Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
