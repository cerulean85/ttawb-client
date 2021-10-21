import React from "react"
import '../App.css';
import * as R from "../Resources";
import * as CFG from "../Config"
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import ProgressStateTextBox from "./ProgressStateTextBox";
import WorkItem from "./WorkItem";

const moment = require('moment');
class PopupWorkDetail extends React.Component {

    constructor(props) {

        // console.log('constructor')
        super(props);
        this.handleMouseHover = this.handleMouseHover.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

        this.state = {
            list: [],
            opacity: 1.0,
            item: props.item,
            log: ''
        };
        // this.textLog = React.createRef();


    }

    handleMouseHover(e) { this.setState(this.toggleHoverState); }
    handleMouseLeave(e) { this.setState(this.toggleLeaveState); }
    toggleHoverState(e) { return { opacity: 0.5 }; }
    toggleLeaveState(e) { return { opacity: 1.0 }; }

    updateName=() => {

        const request = async () => {

            // console.log('보자보자')
            // console.log(this.state.item)
            let data = {
                group_id: this.state.item.group_id,
                name: this.state.item.name
            };

            // console.log(data);

            const response = await axios.post("http://" + CFG.proxyIP + ':' + CFG.proxyPort + "/action/update_work_group_name", data);
            if(response.status !== 200) {
                alert('요청한 작업을 수행할 수 없습니다.');
            } else {
                alert('처리되었습니다.')
            }
        };
        request()
    };

    onNameChanged = (d) => {
        this.state.item.name = d.target.value;
        this.setState({
            item: this.state.item,
        })
    };

    componentDidMount() {
        this.update();
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );

        this.updateID = setInterval(
            () => this.update(),
            10000
        );
    }

    getWorkStateList = () => {

        let data = {
            group_id: this.state.item.group_id
        };

        axios.post("http://" + CFG.proxyIP + ':' + CFG.proxyPort + "/action/get_work_state_list", data).then( (response) => {
            const list = response.data.list;
            this.setState({list: list});
            console.log(list[0])
        });
    };

    tick() {
        this.setState({
            date: new Date()
        });

        let item = this.state.item;
        if(item.current_state === R.STATE_PROCESSING) {
            item.running_time = item.running_time + 1;

        }
        this.setState({item: item})
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        clearInterval(this.updateID);
    }

    update() {

        this.getWorkStateList()

        axios.post("http://" + CFG.proxyIP + ':' + CFG.proxyPort + "/action/get_work_group", {
            group_id: this.state.item.group_id
        }).then((response) => {
            let oldItem = this.state.item;
            let newItem = response.data.list[0];

            if (oldItem.current_state === R.STATE_PROCESSING && newItem.current_state === R.STATE_PROCESSING) {
                if (oldItem.group_id === newItem.group_id) {
                    oldItem.current_work_count = newItem.current_work_count;
                    oldItem.total_work_count = newItem.total_work_count;
                    oldItem.running_time = newItem.running_time;
                    oldItem = newItem;
                }
            }

            this.setState({item: oldItem})
        });
    }

    componentDidUpdate() {
        // this.textLog.current.scrollTop = this.textLog.current.scrollHeight;
    }

    onLogChanged = (d) => {
        this.state.log += '\n' + d.target.value;
        this.setState({
            log: this.state.log,
        })
    };

    renderProgressStateTextBox() {
        return <ProgressStateTextBox
            value={this.state.item.current_state}
        />;
    }

    render() {

        let tmpKwdSet = [
            { keyword: this.state.item.keyword1, opt: this.state.item.keyword_opt1},
            { keyword: this.state.item.keyword2, opt: this.state.item.keyword_opt2},
            { keyword: this.state.item.keyword3, opt: this.state.item.keyword_opt3},
            { keyword: this.state.item.keyword4, opt: this.state.item.keyword_opt4},
            { keyword: this.state.item.keyword5, opt: this.state.item.keyword_opt5} ];

        let kwdKeySet = [ tmpKwdSet[0].keyword ];

        for (let i=1; i<tmpKwdSet.length; i++) {

            const kwdKeySetSize = kwdKeySet.length;
            const kwdFormat = tmpKwdSet[i];
            if(kwdFormat.keyword === undefined || kwdFormat.keyword === '') continue;

            if(kwdFormat.opt === 'and') {
                for (let k=0; k<kwdKeySetSize; k++) {
                    const keyword = kwdKeySet[k];
                    if(keyword === undefined || keyword === '') continue;
                    kwdKeySet[k] = keyword + ' ' + kwdFormat.keyword;
                }
            }

            if(kwdFormat.opt === 'or') {
                for (let k=0; k<kwdKeySetSize; k++) {
                    const keyword = kwdKeySet[k];
                    if(keyword === undefined || keyword === '') continue;
                    kwdKeySet.push(keyword + ' ' + kwdFormat.keyword);
                    kwdKeySet.push(kwdFormat.keyword);
                }
            }
        }

        let keywords = '';
        for (let i=0; i<kwdKeySet.length; i++) {
            keywords += kwdKeySet[i] + ( i === (kwdKeySet.length-1) ? '': '\u00A0,\u00A0\u00A0\u00A0');
        }

        let targets = '';
        const collectTarget = this.state.item.collect_target.split('/');
        for(let i=0; i<collectTarget.length; i++) {
            const name = collectTarget[i];
            if(name === undefined || name === '') continue;
            targets += R.CollectTargetName[collectTarget[i]] + "\u00A0\u00A0\u00A0\u00A0";
        }

        const secs = this.state.item.running_time;

        const hourNum = Math.floor(secs / 3600);
        const hourMod = secs % 3600;
        const minuteNum = Math.floor(hourMod / 60);
        const minuteMod = hourMod % 60;

        const hour   = (hourNum < 10 ? '0':'') + hourNum;
        const minute = (minuteNum < 10 ? '0':'') + minuteNum;
        const second = (minuteMod < 10 ? '0':'') + minuteMod;


        let no = 1;
        const listItems = this.state.list.map((item) =>
             <div style={{width: '100%', display: 'flex', height:'50px'}}>
                 <div style={{width: '5%', color:'#aaaaaa'}}>{no++}</div>
                 <div style={{width: '8%', color:'#aaaaaa'}}>{R.CollectTargetName[item.site_type]}</div>
                 <div style={{width: '22%'}}>{item.keyword}</div>
                 <div style={{ width: '20%', color: '#666666' }}>
                     <label style={{color:'#0099ff', fontSize:18}}>{item.total_work_count}</label>건&nbsp;중
                     &nbsp;&nbsp;<label style={{color:'#a9d18e', fontSize:16}}>{item.finished_work_count}</label>
                     &nbsp;건&nbsp;완료
                 </div>


                 <div style={{width: '10%'}}>{

                     item.total_work_count > 0 ?

                         (item.finished_work_count > item.total_work_count ?
                             100:Math.floor(item.finished_work_count*100/item.total_work_count)) : 0

                 }%</div>
                 <div style={{width: '15%'}}><ProgressStateTextBox value={item.current_state}/></div>
             </div>
         );

        return (
            <div style={{
                position: 'fixed',
                background: '#00000044',
                width: '100%',
                height: '120vh',
                top: 0,
                left: 0
            }}>

                <div style={{
                    position: 'relative',
                    width: '80%',
                    margin: '0 auto',
                    height: 'auto',
                    maxHeight: 100,
                    marginTop: 'calc(100vh - 85vh - 20px)',
                    background: '#000000',
                    // paddingLeft: 20,
                    // paddingRight: 20,
                    paddingTop: 10,
                    paddingBottom: 12,
                    borderTop: '1px solid #999',
                    borderLeft: '1px solid #999',
                    borderRight: '1px solid #999',
                    overflow: 'auto',
                    display: 'flex'
                }}>
                    <div style={{fontSize: 20}}>&nbsp;&nbsp;&nbsp;&nbsp;상세 보기</div>
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'right'}}>
                        <div style={{
                            cursor: 'pointer',
                            display:'inline-block',
                            width:30, height: 20,
                            paddingTop: 5, paddingRight: 14, opacity: this.state.opacity}}
                             onMouseEnter={this.handleMouseHover}
                             onMouseLeave={this.handleMouseLeave}
                             onClick={ this.props.handleClose }>
                            <img src={R.Images['close']}/>
                        </div>
                    </div>
                </div>
                <div style={{
                    position: 'relative',
                    width: '80%',
                    margin: '0 auto',
                    height: '52%',
                    background: '#212121',
                    borderLeft: '1px solid #999',
                    borderRight: '1px solid #999',
                    borderBottom: '1px solid #999',
                    overflow: 'auto',
                }}>

                    <div style={{
                        width: '100%',
                        marginTop: 40,
                        fontSize: 18,
                        display:'flex'
                    }}>
                        <div style={{width:'5%' }}/>
                        <div style={{width:'15%', textAlign:'center'}}>작업이름</div>
                        <input style={{width: '50%'}} type='text' onChange={this.onNameChanged} value={this.state.item.name}/>
                        <div style={{width:10 }}/>
                        <button style={{
                            width:50, fontSize:14, cursor:'pointer',
                            backgroundColor:'#0099FF', color: '#FFFFFF', border:'0px'}}
                                onClick={this.updateName}>수정
                        </button>
                    </div>

                    <div style={{
                        width: '100%',
                        marginTop: 40,
                        fontSize: 18,
                        display:'flex'
                    }}>
                        <div style={{width:'5%' }}/>
                        <div style={{width:'15%', textAlign:'center'}}>키워드</div>
                        <div style={{width:'70%', color:'#aaaaaa', textAlign:'left', wordWrap: 'break-word'}}>
                            {keywords}
                        </div>
                    </div>

                    <div style={{
                        width: '100%',
                        marginTop: 40,
                        fontSize: 18,
                        display:'flex'
                    }}>
                        <div style={{width:'5%' }}/>
                        <div style={{width:'15%', textAlign:'center'}}>수집기간</div>
                        <div style={{display:'flex', color:'#aaaaaa'}}>{moment(this.state.item.start_date).format('YYYY-MM-DD')}&nbsp;~&nbsp;{moment(this.state.item.end_date).format('YYYY-MM-DD')}</div>
                </div>

                    <div style={{
                        width: '100%',
                        marginTop: 40,
                        fontSize: 18,
                        display:'flex'
                    }}>
                        <div style={{width:'5%' }}/>
                        <div style={{width:'15%', textAlign:'center'}}>수집대상</div>
                        <div style={{width:'70%', color:'#aaaaaa', textAlign:'left', wordWrap: 'break-word'}}>{targets}</div>
                    </div>

                    <div style={{
                        width: '100%',
                        marginTop: 40,
                        fontSize: 18,
                        display:'flex'
                    }}>
                        <div style={{width:'5%' }}/>
                        <div style={{width:'15%', textAlign:'center'}}>진행상태</div>
                        {this.renderProgressStateTextBox()}
                        <div>

                            <div style={{ marginLeft: 20, textAlign:'left', fontSize:14, color: '#666666' }}>
                                <label style={{color:'#ff9e01', fontSize:16}}>{hour}:{minute}:{second}</label>&nbsp;&nbsp;경과
                            </div>
                            <div style={{ marginLeft: 20, textAlign:'left', fontSize:14, color: '#666666' }}>
                                <label style={{color:'#0099ff', fontSize:18}}>{this.state.item.total_work_count}</label>건&nbsp;중
                                &nbsp;&nbsp;<label style={{color:'#a9d18e', fontSize:16}}>{this.state.item.current_work_count}</label>
                                &nbsp;건&nbsp;완료
                            </div>
                        </div>

                    </div>

                    <div style={{
                        width: '100%',
                        marginTop: 8,
                        fontSize: 18,
                        display:'flex'
                    }}>
                        <div style={{width:'5%' }}/>
                        <div style={{width:'15%', textAlign:'center'}}></div>
                        <div style={{fontSize: 14, textAlign:'left', display:'flex', color:'#aaaaaa'}}>(&nbsp;수집경로:&nbsp;&nbsp;&nbsp;<label style={{color:'#0099FF'}}>{'C:\\User\\JHKim\\Desktop\\DATA'}</label>&nbsp;&nbsp;)</div>
                    </div>

                    <div style={{
                        width: '100%',
                        marginTop: 40,
                        fontSize: 18,
                        display:'flex'
                    }}>
                        <div style={{width:'5%' }}/>
                        <div style={{width:'15%', textAlign:'center'}}></div>
                        <div style={{width: '80%'}}>
                            {listItems}
                        </div>
                        {/*<textarea ref={this.textLog} style={{width:'70%', height:200, resize:'none'}} readOnly={true} value={this.state.log} onChange={this.onLogChanged}/>*/}
                    </div>

                </div>
            </div>

        );
    }
}
export default PopupWorkDetail;
