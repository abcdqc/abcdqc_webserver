import React, { Component } from 'react'
import { select } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import { max, extent, merge } from 'd3-array'
import { area, curveCatmullRom } from 'd3-shape'

const DENSITY_INDEX = 1;
const VALUE_INDEX = 0;
// set the dimensions and margins of the graph
const MARGIN = {top: 10, right: 30, bottom: 30, left: 60};
const WIDTH = 660 - MARGIN.left - MARGIN.right;
const HEIGHT = 400 - MARGIN.top - MARGIN.bottom;


export default class Chart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showBoxPlot: true,
            splitViolin: false
        }
    }

    setShowBoxPlot(shouldShow) {
        this.setState(state => ({
            showBoxPlot: shouldShow
        }));
    }
    
    componentDidMount() {
        // console.log("componentDidMount");
        // this.timerID = setInterval(
            // () => this.enableData(),
            // 2000
        // );

        // D3 Code to create the chart
        // using this._rootNode as container
        this.svg = select(this._rootNode)
            .append("svg")
                .attr("width", WIDTH + MARGIN.left + MARGIN.right)
                .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
            .append("g")
            .attr("transform",
                "translate(" + MARGIN.left + "," + MARGIN.top + ")");

        this.svg.append("text")
            .attr("class", "nodatamsg")
            .attr("x", 10)
            .attr("y", HEIGHT/2)
            .text("No data provided");

        // X axis
        this.svg.append("g")
            .attr("transform", "translate(0," + HEIGHT + ")")
            .attr("class", "xaxis");
        // Y axis
        this.svg.append("g")
            .attr("class", "yaxis");
        // Vertical label
        this.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("class", "ylabel")
            .attr("y", 0 - MARGIN.left)
            .attr("x",0 - (HEIGHT / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle");
        // Probably bad style, but all of our rendering code is in this method so go ahead and call it
        this.componentDidUpdate();
    }

    componentWillUnmount() {
        // clearInterval(this.timerID);
    }

    shouldComponentUpdate() {
        return true;
    }

    componentDidUpdate() {
        if (!this.getData()) {
            console.log("No plot data");
        } else {
            // Hide the message
            this.svg.select(".nodatamsg").remove();

            // Update the Y scale
            this.y = scaleLinear()
                .domain(this.getYExtent(this.getData()))
                .range([HEIGHT, 0]);
            this.svg.select(".yaxis")
                .call(axisLeft(this.y));

            // Build and update the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
            this.x = scaleBand()
                .range([0, WIDTH])
                .domain(this.getData().map(entry => entry.key))
                .padding(0.05);     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.

            this.svg.select(".xaxis")
                .call(axisBottom(this.x));

            this.svg.select(".ylabel")
                .text(this.props.label);     

            this.originalPlot();
        }
    }

    _setRef(componentNode) {
        this._rootNode = componentNode;
    }

    render() {
        return (
            <div className="graph-container" ref={this._setRef.bind(this)}/>
        );
    }

    getViolinXAxis(data) {
        // What is the biggest value that the density estimate reach?
        let maxNum = max(data.filter(entry => entry.kde !== undefined).map(entry =>
            max(entry.kde.map(coord => coord[DENSITY_INDEX]))
        ));

        // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
        let xNum = scaleLinear()
            .range([0, this.x.bandwidth()])
            .domain([-maxNum, maxNum]);
        return xNum;
    }

    getYExtent(data) {
        let a = extent(merge(data.filter(entry => entry.kde !== undefined).map(entry =>
            extent(entry.kde.map(coord => coord[VALUE_INDEX]))
        )));
        return a;
    }

    originalPlot() {
        console.log("Plotting");
        if (this.getData() === undefined) {
            return;
        }
        var xNum = this.getViolinXAxis(this.getData(), this.x);

    
        const boxPlotX1 = this.x.bandwidth()*.35,
            boxPlotX2 = this.x.bandwidth()*.65,
            boxPlotWidth = boxPlotX2 - boxPlotX1;

        let g = this.svg
            .selectAll(".violin")
            .data(this.getData())
            .enter()        // So now we are working group per group
            .append("g")
                .attr("transform", d => ("translate(" + this.x(d.key) + " ,0)")) // Translation on the right to be at the group position
                .attr("class", "violin");
        this.svg
            .selectAll(".violin")
            .data(this.getData())
            .exit()
            .remove()

        let all = this.svg.selectAll(".violin")
            .data(this.getData());

        g.append("path")
            .attr("class", "rightViolin");

        // Right half of violin
        all.select(".rightViolin")
            .attr("class", "rightViolin")
            .filter(d => d.kde !== undefined)
            .datum(d => d.kde)     // So now we are working density per density
            .style("stroke", "none")
            .style("fill", "#3f51b5")
            .attr("d", area()
                // .x0(function(d){ return(xNum(-d[1])) } )
                .x0(xNum(0))
                .x1(d => xNum(d[DENSITY_INDEX]))
                .y(d => this.y(d[VALUE_INDEX]))
                .curve(curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
            );
        // Left half of violin
        g.append("path")
            .attr("class", "leftViolin");
        all.select(".leftViolin")
            .filter(d => d.kde !== undefined)
            .datum(d => d.kde)
            .style("stroke", "none")
            .style("fill", "#3f51b5")
            // .style("fill", "red")
            .attr("d", area()
                // .x0(d => xNum(-d[DENSITY_INDEX] / 2))
                .x0(d => xNum(-d[DENSITY_INDEX]))
                .x1(xNum(0))
                .y(d => this.y(d[VALUE_INDEX]))
                .curve(curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
            );

        // Box plots don't make sense with a split violin
        if (!this.state.splitViolin && this.state.showBoxPlot) {
            let boxplotColor = "#888888";
            let boxG = this.svg
                .selectAll(".box")
                .data(this.getData())
                .enter()        // So now we are working group per group
                .append("g")
                    .attr("transform", d => ("translate(" + this.x(d.key) + " ,0)")) // Translation on the right to be at the group position
                    .attr("class", "box");
            this.svg
                .selectAll(".box")
                .data(this.getData())
                .exit()
                .remove()

            let boxplots = this.svg
                .selectAll(".box")
                .data(this.getData())
                .filter(d => d.boxplot !== undefined);

            // Vertical whiskers
            boxG.append("line")
                .attr("class", "bottomWhisker");
            boxplots.select(".bottomWhisker")
                .attr("class", "bottomWhisker")
                .attr("y1", d => this.y(d.boxplot.extremes[0]))
                .attr("y2", d => this.y(d.boxplot.quartiles[0]))
                .attr("x1", xNum(0))
                .attr("x2", xNum(0))
                .style("stroke", boxplotColor);
            boxG.append("line")
                .attr("class", "topWhisker");
            boxplots.select(".topWhisker")
                .attr("class", "topWhisker")
                .attr("y1", d => this.y(d.boxplot.extremes[1]))
                .attr("y2", d => this.y(d.boxplot.quartiles[1]))
                .attr("x1", xNum(0))
                .attr("x2", xNum(0))
                .style("stroke", boxplotColor);
            // Horizontal whisker
            boxG.append("line")
                .attr("class", "bottomWhiskerBar");
            boxplots.select(".bottomWhiskerBar")
                .attr("class", "bottomWhiskerBar")
                .attr("y1", d => this.y(d.boxplot.extremes[0]))
                .attr("y2", d => this.y(d.boxplot.extremes[0]))
                .attr("x1", boxPlotX1)
                .attr("x2", boxPlotX2)
                .style("stroke", boxplotColor);
            boxG.append("line")
                .attr("class", "topWhiskerBar");
            boxplots.select(".topWhiskerBar")
                .attr("class", "topWhiskerBar")
                .attr("y1", d => this.y(d.boxplot.extremes[1]))
                .attr("y2", d => this.y(d.boxplot.extremes[1]))
                .attr("x1", boxPlotX1)
                .attr("x2", boxPlotX2)
                .style("stroke", boxplotColor);
            // Boxes
            boxG.append("rect")
                .attr("class", "quartileBox");
            boxplots.select(".quartileBox")
                .attr("class", "quartileBox")
                .attr("x", boxPlotX1)
                .attr("y", d => this.y(d.boxplot.quartiles[1]))
                .attr("width", boxPlotWidth)
                .attr("height", d => this.y(d.boxplot.quartiles[0]) - this.y(d.boxplot.quartiles[1]))
                .style("stroke", boxplotColor)
                .style("fill", "none")
        } else {
            this.svg
                .selectAll(".box")
                .data([]) // No box plots
                .exit()
                .remove()
        }
    }

    getData() {
        return this.props.data;
    }
}
