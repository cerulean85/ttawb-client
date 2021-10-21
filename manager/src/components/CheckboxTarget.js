import React from "react";

class CheckboxTarget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

        return (
            <div style={{ textAlign: 'left', width: this.props.width, height:30, display:'flex'}}>
                <input type="checkbox"
                       style={{ width:20, height:20, marginTop:5 }}
                       name={this.props.name}
                       checked={this.props.target}
                       onChange={this.props.onChanged} />
                <div style={{marginLeft: 5}}>{this.props.text}</div>
            </div>
        );
    }
}

export default CheckboxTarget;