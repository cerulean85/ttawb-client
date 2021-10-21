import React from "react";
import * as R from "../Resources.js";

class ProgressStateTextBox extends React.Component {

    expression = {
        label: R.StateExpression[this.props.value],
        width: R.StateExpression[this.props.value],
        backgroundColor: R.StateExpression[this.props.value]
    };

    constructor(props) {
        super(props);
        this.update()
    }

    update() {
        const expression = R.StateExpression[this.props.value];
        this.expression.label = expression.label;
        this.expression.backgroundColor = expression.backgroundColor;
        this.expression.width = expression.width;
        // if(this.props.value === R.StateExpression.collecting || this.props.value === R.StateExpression.processing) {
        //     alert(this.props.value)
        //     this.expression.width = 200
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.state !== prevProps.value.state) return;
        this.update()
    }

    // getHeight(state) {
    //     alert(state)
    //     if(state === R.StateExpression.collecting || state === R.StateExpression.processing) return 200
    //     else return 80
    // }

    render() {

        return (
          <div
                className="progressStateTextBox"
                style={
                    {
                        width: this.expression.width, height: 35,
                        backgroundColor: this.expression.backgroundColor,
                        position: 'relative'
                    }
                }
                onClick={() => this.props.onClick()}
            >
              <div
                  style={{
                      position: 'absolute',
                      width: this.expression.width,
                      top: '50%',
                      left: '50%',
                      backgroundColor: this.expression.backgroundColor,
                      transform: 'translate(-50%, -50%)',
                      fontSize: 14
                  }}
              >
                {this.expression.label}
              </div>
          </div>
        );
    }
}

export default ProgressStateTextBox;