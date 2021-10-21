import './App.css';
import React, { useState } from "react";
import ButtonOpenAddWorkWindow from "./components/ButtonOpenAddWorkWindow";
import * as R from "./Resources";
import Header from './components/Header'
import WorkTable from "./components/WorkTable";
import PopupWorkCreate from "./components/PopupWorkCreate"

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };

        this.togglePopup = this.togglePopup.bind(this);
    }

    togglePopup = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    // componentDidMount() {
    //     fetch("http://localhost:3001/action/get_work_group_list")
    //         .then(res => res.json())
    //         .then(data => this.setState({title: data.title}))
    // }

    render() {
        return (
            <div className="App">
                <Header/>
                <div style={{margin: 'auto', width: '80%', marginBottom: 20}}>
                    <ButtonOpenAddWorkWindow onClick={this.togglePopup}/>
                </div>

                <WorkTable openPopup={this.togglePopup}/>
                {this.state.isOpen && <PopupWorkCreate
                    content={<>
                        {/*<b>Design your PopupWorkCreate</b>*/}
                        {/*<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>*/}
                        {/*<button>Test button</button>*/}
                    </>}
                    handleClose={this.togglePopup}
                />}
            </div>


        );
    }


//   function App() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
}
export default App;