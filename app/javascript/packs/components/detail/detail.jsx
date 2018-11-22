import React from 'react';


class Detail extends React.Component {
  constructor(props) {
    super(props)
 };

// **********************
// HANDLERS
// **********************

  render() {
    console.log("detail", this.props.clicked);

    return (
        <div className="detail">

        </div>
    );
  }
}

export default Detail;