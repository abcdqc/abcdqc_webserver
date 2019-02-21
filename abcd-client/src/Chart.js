import React, { Component } from 'react'

export default class Chart extends Component {
    componentDidMount() {
        // D3 Code to create the chart
        // using this._rootNode as container
    }

    shouldComponentUpdate() {
        return false;
    }

    _setRef(componentNode) {
        this._rootNode = componentNode;
    }

    render() {
        return (
            <div>
            <div className="graph-container" ref={this._setRef.bind(this)} />
            Add D3 here
            </div>
        );
    }
}
