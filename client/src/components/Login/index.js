import React, { Component } from "react";
import Axios from "axios";
import Jumbotron from "../Jumbotorn";
import { Col, Row, Container } from "../Grid";

class Signup extends Component {
  state = {
    username: "",
    password: "",
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //   handleSubmit to send the axios req to DB for username: & password:
  //   If successful, will redirect to Login page.
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      `handleFormSubmit username: ${this.state.username}, password: ${this.state.password}`
    );

    Axios.post('/api/user',  {
      username: this.state.username,
      password: this.state.password
    })
      .then((res) => {
        console.log(res);
        if (res.data) {
          console.log(`Sign-in Successful`);
          this.setState({
            redirectTo: "Login",
          });
        }
      })
      .catch((err) => {
        if (err) console.log(`Sign-Up server error ${err}`);
      });
  };

  //   Bootstrap Login Form;
  render() {
    return (
      <Container>
        <Jumbotron text="Log In"/>

        <form className="" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="">User Name</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </Container>
    );
  }
}

export default Signup;