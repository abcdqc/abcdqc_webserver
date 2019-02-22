import React, { Component } from 'react'
import { select } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import { max, extent, merge } from 'd3-array'
import { area, curveCatmullRom } from 'd3-shape'

const DENSITY_INDEX = 1;
const VALUE_INDEX = 0;

export default class Chart extends Component {
    
    componentDidMount() {
        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 40};
        const width = 460 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // D3 Code to create the chart
        // using this._rootNode as container
        let svg = select(this._rootNode)
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        let total = this.getData();
        if (total === undefined) {
            svg.append("text")
                .attr("x", 10)
                .attr("y", height/2)
                .text("No data provided")
        } else {
            // Eventually, the data will look like this:
            let data = {
                Total: {
                    kde: total
                }
            }

            /*sumstat[0].extremes = [4.0, 6.5];
            sumstat[0].quartiles = [4.5, 5.5];
            sumstat[1].extremes = [4.5, 7.7];
            sumstat[1].quartiles = [5.5, 6.5];
            sumstat[2].extremes = [4.0, 8.0];
            sumstat[2].quartiles = [6.0, 7.2];*/

            this.originalPlot(svg, width, height, data);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    _setRef(componentNode) {
        this._rootNode = componentNode;
    }

    render() {
        return (
            <div className="graph-container" ref={this._setRef.bind(this)}/>
        );
    }

    getViolinXAxis(data, x) {
        // What is the biggest value that the density estimate reach?
        let maxNum = max(data.map(entry =>
            max(entry.kde.map(coord => coord[DENSITY_INDEX]))
        ));

        // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
        let xNum = scaleLinear()
            .range([0, x.bandwidth()])
            .domain([-maxNum, maxNum]);
        return xNum;
    }

    getYExtent(data) {
        let a = extent(merge(data.map(entry =>
            { let e = extent(entry.kde.map(coord => coord[VALUE_INDEX])); console.log(e); return e; }
        )));
        console.log(a);
        return a;
    }

    originalPlot(svg, width, height, data) {
        // To handle many plots, D3 wants an array with one element per plot. We need the key name in the element, so map it
        let d3data = Object.entries(data).map(([key, value]) => {
            value.key = key;
            return value
        });

        // Build and Show the Y scale
        let y = scaleLinear()
            .domain(this.getYExtent(d3data))          // Note that here the Y scale is set manually
            .range([height, 0]);
        svg.append("g").call(axisLeft(y));

        // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
        var x = scaleBand()
            .range([0, width])
            .domain(d3data.map(entry => entry.key))
            .padding(0.05);     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(axisBottom(x));

        var xNum = this.getViolinXAxis(d3data, x);
    
        const boxPlotX1 = x.bandwidth()*.25,
            boxPlotX2 = x.bandwidth()*.75,
            boxPlotWidth = boxPlotX2 - boxPlotX1;

        let g = svg
            .selectAll("myViolin")
            .data(d3data)
            .enter()        // So now we are working group per group
            .append("g")
                .attr("transform", d => ("translate(" + x(d.key) + " ,0)")); // Translation on the right to be at the group position

        // Right half of violin
        g.append("path")
            .attr("class", "rightViolin")
            .datum(d => d.kde)     // So now we are working density per density
            .style("stroke", "none")
            .style("fill", "#69b3a2")
            .attr("d", area()
                // .x0(function(d){ return(xNum(-d[1])) } )
                .x0(xNum(0))
                .x1(d => xNum(d[DENSITY_INDEX]))
                .y(d => y(d[VALUE_INDEX]))
                .curve(curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
            );
        // Left half of violin
        g.append("path")
            .attr("class", "leftViolin")
            .datum(d => d.kde)
            .style("stroke", "none")
            .style("fill", "red")
            .attr("d", area()
                .x0(d => xNum(-d[DENSITY_INDEX] / 2))
                .x1(xNum(0))
                .y(d => y(d[VALUE_INDEX]))
                .curve(curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
            );
        if (this.props.showBoxPlot) {
            // Vertical whiskers
            g.append("line")
                // .datum(function(d){ return(d.extremes)})
                .attr("y1", d => y(d.extremes[0]))
                .attr("y2", d => y(d.quartiles[0]))
                .attr("x1", xNum(0))
                .attr("x2", xNum(0))
                .style("stroke", "black");
            g.append("line")
                .attr("y1", d => y(d.extremes[1]))
                .attr("y2", d => y(d.quartiles[1]))
                .attr("x1", xNum(0))
                .attr("x2", xNum(0))
                .style("stroke", "black");
            // Horizontal whisker
            g.append("line")
                .attr("y1", d => y(d.extremes[0]))
                .attr("y2", d => y(d.extremes[0]))
                .attr("x1", boxPlotX1)
                .attr("x2", boxPlotX2)
                .style("stroke", "black");
            g.append("line")
                .attr("y1", d => y(d.extremes[1]))
                .attr("y2", d => y(d.extremes[1]))
                .attr("x1", boxPlotX1)
                .attr("x2", boxPlotX2)
                .style("stroke", "black");
            // Boxes
            g.append("rect")
                .attr("x", x.bandwidth() * .25)
                .attr("y", d => y(d.quartiles[1]))
                .attr("width", boxPlotWidth)
                .attr("height", d => y(d.quartiles[0]) - y(d.quartiles[1]))
                .style("stroke", "black")
                .style("fill", "none")
        }
    }

    getData() {
        return this.props.data;
    }
}
