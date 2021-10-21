import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <div
                style={{
                    margin: 'auto',
                    width: '80%',
                    height: 120,
                    borderTop: '1px solid black',
                    paddingTop: 60,
                    fontSize: 50
                }}
            >BIG DATA COLLECTION
            </div>
        )
    }
}

export default Header;