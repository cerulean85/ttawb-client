import React from "react";

class ButtonCreateWork extends React.Component {

    constructor(props) {
        super(props);
        this.handleMouseHover = this.handleMouseHover.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.state = {
            opacity: 1.0,
        };
    }

    handleMouseHover() { this.setState(this.toggleHoverState); }
    handleMouseLeave() { this.setState(this.toggleLeaveState); }

    toggleHoverState(state) { return { opacity: 0.5 }; }
    toggleLeaveState(state) { return { opacity: 1.0 }; }

    render() {

        return (

            <button style={{
                        width:this.props.width, height: this.props.height,
                        fontSize:18, marginTop: 60, cursor:'pointer',
                        backgroundColor: this.props.backgroundColor,
                        marginLeft: this.props.marginLeft,
                        opacity: this.state.opacity,
                        color: '#FFFFFF', border:'0px'}}
                    onMouseEnter={this.handleMouseHover}
                    onMouseLeave={this.handleMouseLeave}
                    onClick={() => this.props.onClick()}>{this.props.text}</button>
        );
    }
}

export default ButtonCreateWork;