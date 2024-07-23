import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../../../Redux_Store/api/authApis";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading, error, data, isSuccess }] = useLoginMutation();
  console.log(data);
  console.log(error);
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (data) {
      toast.success("Welcome To MyStore");
    }
  }, [error, data]);

  const submitHandler = (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    login(loginData);
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow rounded bg-body" onSubmit={submitHandler}>
          <h2 className="mb-4">Login</h2>
          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              autoComplete="true"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <a href="/password/forgot" className="float-end mb-4">
            Forgot Password?
          </a>

          <button
            id="login_button"
            type="submit"
            disabled={isLoading}
            className="btn w-100 py-2 "
          >
            {isLoading ? "submitting" : "Login"}
          </button>

          <div className="my-3">
            <Link to="/register" className="float-end">
              New User?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
