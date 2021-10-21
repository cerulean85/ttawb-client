import React from "react";
import WorkItem from "./WorkItem";
import * as R from "../Resources";
import * as CFG from "../Config"
import axios from "axios";
import PopupWorkDetail from "./PopupWorkDetail";
import {proxyIP} from "../Config";

class WorkTable extends React.Component {

    constructor(props) {
        super(props);
        // console.log('constructor')
        this.state = {
            list: [],
            isOpen: false,
            date: new Date(),
            popupItem: {}
        };

        // this.test = this.test.bind(this)
    }

    componentDidMount() {

        this.timerID = setInterval(
            () => this.tick(),
            1000
        );

        this.updateID = setInterval(
            () => this.update(),
            1000
        );


    }

    tick() {
        this.setState({
            date: new Date()
        });

        let list = this.state.list;
        for(let i=0; i<list.length; i++) {
            let item = list[i];
            if(item.current_state === R.STATE_PROCESSING) {
                let v1 = new Date(item.work_started_datetime);
                let v2 = Date.now();
                item['view_running_time'] = item.running_time + Math.floor((v2 - v1.getTime()) / 1000);
                list[i] = item;
            } else {
                item['view_running_time'] = item.running_time;
            }
         }

        this.setState({list: list})
    }

    update() {
        this.getWorGroupList();
        // axios.post('http://localhost:3030/get_processing_work_list').then( (response) => {
        //     let oldList = this.state.list;
        //     let newList = response.data.list;
        //     for(let i=0; i<oldList.length; i++) {
        //         let oldItem = oldList[i];
        //         for(let k=0; k<newList.length; k++) {
        //             let newItem = newList[k];
        //
        //             // if(oldItem.current_state === R.STATE_PROCESSING) {
        //             if(oldItem.group_id === newItem.group_id) {
        //                 oldItem.current_work_count = newItem.current_work_count;
        //                 oldItem.total_work_count = newItem.total_work_count;
        //                 oldItem.work_started_datetime = newItem.work_started_datetime;
        //                 oldItem.running_time = newItem.running_time;
        //                 oldItem.current_state = newItem.current_state;
        //                 oldList[i] = oldItem;
        //                 break;
        //             }
        //             // }
        //         }
        //     }
        //     this.setState({list: oldList})
        // });
        // this.getWorkList();
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        clearInterval(this.updateID);
    }

    openPopup = (item) => {
        // console.log('이건가??')
        // console.log(e)
        this.setState({isOpen: !this.state.isOpen, popupItem: item})
    };

    closePopup = () => {
        window.location.reload();
        // window.scrollTo(0, 0);
        this.setState({isOpen: false})
    };

    getWorGroupList = () => {
        axios.post("http://" + CFG.proxyIP + ':' + CFG.proxyPort + "/action/get_work_group_list").then( (response) => {
            const list = response.data.list;
            this.setState({list: list})
        });
    };

    render() {

        const listItems = this.state.list.map((item) =>
            <WorkItem value={item} openPopup={this.openPopup.bind(this, item)}/>
        );

        return (

            <div
                style={{
                    margin: 'auto',
                    width: '80%',
                    borderTop: '1px solid black',
                }}
            >
                <div style={{borderBottom: '1px solid black', textAlign:'left'}}>
                    <h3>&nbsp;&nbsp;{this.state.date.toLocaleTimeString()}</h3>
                </div>

                {listItems}

                {this.state.isOpen && <PopupWorkDetail
                    item={this.state.popupItem}
                    content={<>
                    </>}
                    handleClose={this.closePopup}
                />}
            </div>
        );
    }
}

export default WorkTable;