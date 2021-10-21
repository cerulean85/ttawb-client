import React from "react";
import * as R from "../Resources";

class ButtonControl extends React.Component {

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

    update() {
        const expression = R.StateExpression[this.props.value];
        this.expression.label = expression.label;
        this.expression.backgroundColor = expression.backgroundColor;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {

        let iconSrc = R.Images[this.props.value] + '.svg';
        if(this.props.currentState === R.STATE_WAITING) {
            if(this.props.value === R.STATE_PAUSED || this.props.value === R.STATE_STOPPED) {
                iconSrc = R.Images[this.props.value] + '_disabled.svg';
            }
            if(this.props.value === R.STATE_PROCESSING) {
                iconSrc = R.Images[R.STATE_PROCESSING] + '.svg';
            }
        }

        if(this.props.currentState === R.STATE_PROCESSING) {
            if(this.props.value === R.STATE_PROCESSING || this.props.value === R.STATE_TERMINATED) {
                iconSrc = R.Images[this.props.value] + '_disabled.svg';
            }
        }

        if(this.props.currentState === R.STATE_PAUSED) {
            if(this.props.value === R.STATE_PAUSED || this.props.value === R.STATE_TERMINATED) {
                iconSrc = R.Images[this.props.value] + '_disabled.svg';
            }
        }

        if(this.props.currentState === R.STATE_STOPPED) {
            if(this.props.value === R.STATE_STOPPED || this.props.value === R.STATE_PAUSED) {
                iconSrc = R.Images[this.props.value] + '_disabled.svg';
            }
        }

        if(this.props.currentState === R.STATE_FINISHED) {
            if(this.props.value === R.STATE_PROCESSING || this.props.value === R.STATE_STOPPED || this.props.value === R.STATE_PAUSED) {
                iconSrc = R.Images[this.props.value] + '_disabled.svg';
            }
            if(this.props.value === R.STATE_FINISHED) {
                iconSrc = R.Images[R.STATE_FINISHED] + '.svg';
            }
        }

        return (
            <div
                style={
                    {
                        width: 30,
                        height: 30,
                        border: '0px',
                        position: 'relative',
                        opacity: this.state.opacity,
                        cursor: 'pointer',
                    }
                }
                onMouseEnter={this.handleMouseHover}
                onMouseLeave={this.handleMouseLeave}
                onClick={(e) => {
                    this.props.onClick();
                    e.stopPropagation();
                }}>
                <img
                    src={ iconSrc }
                    style={{
                        width:20,
                        height: 20,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            </div>
        );
    }
}

export default ButtonControl;