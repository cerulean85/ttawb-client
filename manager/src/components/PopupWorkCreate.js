import React, {useState}from "react"
import '../App.css';
import * as R from "../Resources";
import * as CFG from "../Config"
import DatePicker, { registerLocale, setDefaultLocale } from  "react-datepicker";
import ButtonControlPopup from "./ButtonCreateWork"
import CheckboxTarget from "./CheckboxTarget"
import "react-datepicker/dist/react-datepicker.css";
import ko from 'date-fns/locale/ko';
import axios from 'axios';
registerLocale('ko', ko)



const ParentComponent = props => (
    <div>
        <div style={{
            width: '100%',
            marginTop: 20,
            fontSize: 18,
            display:'flex'
        }}>
            <div style={{width:'5%' }}/>
            <div style={{width:'15%', textAlign:'center'}}>키워드1</div>
            <input style={{width: '50%'}} type='text' onChange={props.keywordChanged} value={props.keyword1}/>
            <select value={props.keywordOpt1} onChange={props.keywordOptChanged} disabled={true}>
                <option value="and">AND</option>
                <option value="or">OR</option>
            </select>
            <div style={{width:10 }}/>

            <button style={{
                width:50, fontSize:14, cursor:'pointer',
                backgroundColor:'#0099FF', color: '#FFFFFF', border:'0px'}}
                    onClick={props.addChild}>추가
            </button>

        </div>
        <div>
            {props.children}
        </div>
    </div>
);

const ChildComponent = (props) => <div>

    <div style={{
        width: '100%',
        marginTop: 20,
        fontSize: 18,
        display:'flex'
    }}>
        <div style={{width:'5%' }}/>
        <div style={{width:'15%', textAlign:'center'}}>키워드{props.number}</div>
        <input style={{width: '50%'}} type='text'
               onChange={props.keywordChanged}
               value={props.keyword} />
        <select
            onChange={props.keywordOptChanged}
            value={props.keywordOpt} >
            <option value="and">AND</option>
            <option value="or">OR</option>
        </select>
    </div>

</div>;


const moment = require('moment');

class PopupWorkCreate extends React.Component {

    constructor(props) {
        super(props);
        this.handleMouseHover = this.handleMouseHover.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

        this.state = {
            opacity: 1.0,
            numChildren: 1,
            name: '테스트',
            keyword1: '코로나',
            keywordOpt1: 'and',
            startDate: moment('2020-01-01').toDate(),
            endDate: moment('2020-02-07').toDate(),
            targetNaver: false,
            targetDaum: false,
            targetChosun: false,
            targetDonga: false,
            targetJoongang: false,
            targetTweeter: false,
            targetFacebook: false,
            targetNaverBlog: false,
            targetInstagram: false,
        };
    }

    handleMouseHover(e) { this.setState(this.toggleHoverState); }
    handleMouseLeave(e) { this.setState(this.toggleLeaveState); }
    toggleHoverState(e) { return { opacity: 0.5 }; }
    toggleLeaveState(e) { return { opacity: 1.0 }; }

    onAddChild = () => {
        if( this.state.numChildren === 5) {
            alert('더 이상 키워드를 추가할 수 없습니다.');
            return;
        }

        this.state[ 'keyword' + ( this.state.numChildren + 1 )  ] = '';
        this.state[ 'keywordOpt' + ( this.state.numChildren + 1 )  ] = '';
        this.setState({
            numChildren: this.state.numChildren + 1
        });
    };

    onNameChanged = (d) => {
        // console.log(d)
        this.setState({
            name: d.target.value,
        })
    };

    onStartDateChanged = (d) => {
        // console.log(moment(d).format('YYYY-MM-DD'))
        this.setState({
            startDate: d,
        })
    };

    onEndDateChanged = (d) => {
        // console.log(moment(d).format('YYYY-MM-DD'))
        this.setState({
            endDate: d,
        })
    };

    onTargetChanged = (d) => {
        const name = d.target.name;
        const value = this.state[name];
        // console.log(name);
        // console.log(value);
        this.setState({ [name]: !value })
    };

    onSubmit = (e) => {


        let collectTarget = (
            // (this.state.targetNaver === true ? 'naver/' : '') +
            // (this.state.targetDaum === true ? 'daum/' : '') +
            // (this.state.targetChosun === true ? 'chosun/' : '') +
            (this.state.targetJoongang === true ? 'jna,' : '') +
            // (this.state.targetDonga === true ? 'donga/' : '') +
            (this.state.targetTweeter === true ? 'twt,' : '') +
            (this.state.targetInstagram === true ? 'ins,' : '') +
            (this.state.targetNaverBlog === true ? 'nav,' : '')
        );

        let data = {
            title: this.state.name,
            start_dt: moment(this.state.startDate).format('YYYY-MM-DD'),
            end_dt: moment(this.state.endDate).format('YYYY-MM-DD'),
            channels: collectTarget,
            keywords: '',
            key_opts: ''
        };

        data['keywords'] = ''
        for(let i=0; i<this.state.numChildren; i++) {
            const no = (i + 1);
            data['keywords'] += this.state['keyword' + no]  + ',';
            // let keywordOpt = this.state['keywordOpt' + no];
            // data['key_opts'] += (keywordOpt === '' ? 'and': keywordOpt) + ','
        }

        if (data['channels'].length > 0)
            data['channels'] = data['channels'].substr(0, data['channels'].length - 1)

        if (data['keywords'].length > 0)
            data['keywords'] = data['keywords'].substr(0, data['keywords'].length - 1)

        // if (data['key_opts'].length > 0)
        //     data['key_opts'] = data['key_opts'].substr(0, data['key_opts'].length - 1)

        if(window.confirm('새 작업을 추가하시겠습니까?')) {

            console.log(data)
            axios.post("http://" + CFG.proxyIP + ':' + CFG.proxyPort + "/action/enroll_works", data).then((response) => {
                console.log(data)
                // console.log(response);
                if(response.status === 200) {
                    // window.location.reload();
                    // window.scrollTo(0, 0);
                }
            });
        }
    };

    render() {

        const childrenNums = [];
        for (var i = 2; i < this.state.numChildren + 1; i += 1) {
            childrenNums.push(i);
        }
        const listItems = childrenNums.map((no) =>
            <ChildComponent key={no} number={no}
                            name={'keyword' + no}
                            keywordChanged={(e) => {
                                // console.dir(e.target.value)
                                this.setState({['keyword' + no] : e.target.value})
                            }}
                            // keywordOptChanged={(e) => {
                            //     this.setState({['keywordOpt' + no] : e.target.value})
                            // }}
                            keyword={this.state['keyword' + no]}/>
                            // keywordOpt={this.state['keywordOpt' + no]}/>
        );

        return (
            <div style={{
                position: 'fixed',
                background: '#00000044',
                width: '100%',
                height: '100vh',
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
                    <div style={{fontSize: 20}}>&nbsp;&nbsp;&nbsp;&nbsp;새 작업 추가하기</div>
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
                    height: '50%',
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
                        <input style={{width: '70%'}} type='text' onChange={this.onNameChanged} value={this.state.name}/>
                        <div style={{width:'5%' }}/>
                    </div>

                    <ParentComponent
                        addChild={this.onAddChild}
                        keywordChanged={(e) => {
                            // console.log(e.target)
                            this.setState({
                                keyword1: e.target.value,
                            })
                        }}
                        keywordOptChanged={(e) => {
                            // console.log(e.target)
                            this.setState({
                                keywordOpt1: e.target.value,
                            })
                        }}
                        keyword1={this.state.keyword1}
                        keywordOpt1={this.state.keywordOpt1}>
                        {listItems}
                    </ParentComponent>

                    <div style={{
                        width: '100%',
                        marginTop: 40,
                        fontSize: 18,
                        display:'flex'
                    }}>
                        <div style={{width:'5%' }}/>
                        <div style={{width:'15%', textAlign:'center'}}>수집기간</div>
                        <DatePicker style={{width:'8%', textAlign:'center'}}
                                    onChange={this.onStartDateChanged}
                                    selected={this.state.startDate}
                                    locale={ko}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="시작일:0000-00-00"/>
                        <div style={{width:'2%' }}/>
                        ~
                        <div style={{width:'2%' }}/>
                        <DatePicker style={{width:'8%', textAlign:'center'}}
                                    name='endDate'
                                    onChange={this.onEndDateChanged}
                                    selected={this.state.endDate}
                                    locale={ko}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="종료일:0000-00-00"/>
                    </div>

                    <div style={{
                        width: '100%',
                        marginTop: 20,
                        fontSize: 18,
                        display:'flex'
                    }}>
                        <div style={{width:'5%' }}/>
                        <div style={{width:'15%', textAlign:'center'}} />
                        <div style={{width: '80%', display:'flex'}}>
                            <CheckboxTarget
                                name={"targetChosun"}
                                width={100}
                                text={"조선일보"}
                                checked={this.state.targetChosun}
                                onChanged={this.onTargetChanged}
                            />
                            <div style={{width:'3%' }}/>
                            <CheckboxTarget
                                name={"targetDonga"}
                                width={100}
                                text={"동아일보"}
                                checked={this.state.targetDonga}
                                onChanged={this.onTargetChanged}
                            />
                            <div style={{width:'3%' }}/>
                            <CheckboxTarget
                                name={"targetJoongang"}
                                width={100}
                                text={"중앙일보"}
                                checked={this.state.targetJoongang}
                                onChanged={this.onTargetChanged}
                            />
                        </div>
                    </div>

                    <div style={{
                        width: '100%',
                        marginTop: 20,
                        fontSize: 18,
                        display:'flex'
                    }}>
                        <div style={{width:'5%' }}/>
                        <div style={{width:'15%', textAlign:'center'}} />
                        <div style={{width: '80%', display:'flex'}}>
                            <CheckboxTarget
                                name={"targetTweeter"}
                                width={100}
                                text={"트위터"}
                                checked={this.state.targetTweeter}
                                onChanged={this.onTargetChanged}
                            />
                            <div style={{width:'3%' }}/>
                            <CheckboxTarget
                                name={"targetFacebook"}
                                width={100}
                                text={"페이스북"}
                                checked={this.state.targetFacebook}
                                onChanged={this.onTargetChanged}
                            />
                        </div>
                    </div>

                    <div style={{
                        width: '100%',
                        marginTop: 20,
                        fontSize: 18,
                        display:'flex'
                    }}>
                        <div style={{width:'5%' }}/>
                        <div style={{width:'15%', textAlign:'center'}} />
                        <div style={{width: '80%', display:'flex'}}>
                            <CheckboxTarget
                                name={"targetNaverBlog"}
                                width={150}
                                text={"네이버 블로그"}
                                checked={this.state.targetNaverBlog}
                                onChanged={this.onTargetChanged}
                            />
                        </div>
                    </div>

                    <ButtonControlPopup width={120} height={40} backgroundColor={'#0099FF'} onClick={this.onSubmit} text={'등록하기'}  />
                    <ButtonControlPopup width={80} height={40} backgroundColor={'#ACACAC'} onClick={this.props.handleClose} text={'취소'} marginLeft={10} />

                </div>
            </div>

        );
    }
}
export default PopupWorkCreate;
