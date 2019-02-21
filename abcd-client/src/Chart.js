import React, { Component } from 'react'
import { select } from 'd3-selection'
import { csvParse } from 'd3-dsv'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import { nest } from 'd3-collection'
import { max, mean } from 'd3-array'
import { area, curveCatmullRom } from 'd3-shape'

export default class Chart extends Component {
    componentDidMount() {
        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 40};
        const width = 460 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // D3 Code to create the chart
        // using this._rootNode as container
        let svg = select(".graph-container")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Read the data and compute summary statistics for each specie
        let data = csvParse(this.getData());
        // Build and Show the Y scale
        var y = scaleLinear()
            .domain([3.5, 8])          // Note that here the Y scale is set manually
            .range([height, 0]);
        svg.append("g").call(axisLeft(y));

        // Features of density estimate
        var kde = this.kernelDensityEstimator(this.kernelEpanechnikov(.2), y.ticks(50));
        // Compute the binning for each group of the dataset
        var sumstat = nest()  // nest function allows to group the calculation per level of a factor
            .key(function (d) {
                return d.Species;
            })
            .rollup(function (d) {   // For each key..
                let input = d.map(function (g) {
                    return g.Sepal_Length;
                });    // Keep the variable called Sepal_Length
                let density = kde(input);   // And compute the binning on it.
                return (density);
            })
            .entries(data);

        sumstat[0].extremes = [4.0, 6.5];
        sumstat[0].quartiles = [4.5, 5.5];
        sumstat[1].extremes = [4.5, 7.7];
        sumstat[1].quartiles = [5.5, 6.5];
        sumstat[2].extremes = [4.0, 8.0];
        sumstat[2].quartiles = [6.0, 7.2];

        this.originalPlot(svg, width, height, sumstat, y);
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

    getViolinXAxis(sumstat, x) {
        // What is the biggest value that the density estimate reach?
        let maxNum = 0;
        for (let i in sumstat) {
            let allBins = sumstat[i].value;
            let kdeValues = allBins.map((a) => {
                return a[1]
            });
            let biggest = max(kdeValues);
            if (biggest > maxNum) {
                maxNum = biggest
            }
        }

        // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
        let xNum = scaleLinear()
            .range([0, x.bandwidth()])
            .domain([-maxNum, maxNum]);
        return xNum;
    }

    originalPlot(svg, width, height, sumstat, y) {
        // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
        var x = scaleBand()
            .range([0, width])
            .domain(["setosa", "versicolor", "virginica"])
            .padding(0.05);     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(axisBottom(x));

        var xNum = this.getViolinXAxis(sumstat, x);

        var g = svg
            .selectAll("myViolin")
            .data(sumstat)
            .enter()        // So now we are working group per group
            .append("g")
                .attr("transform", d => ("translate(" + x(d.key) + " ,0)")); // Translation on the right to be at the group position

        // Right half of violin
        g
            .append("path")
            .attr("class", "rightViolin")
            .datum(d => d.value)     // So now we are working density per density
            .style("stroke", "none")
            .style("fill", "#69b3a2")
            .attr("d", area()
                // .x0(function(d){ return(xNum(-d[1])) } )
                .x0(xNum(0))
                .x1(d => xNum(d[1]))
                .y(d => y(d[0]))
                .curve(curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
            );
        // Left half of violin
        g
            .append("path")
            .attr("class", "leftViolin")
            .datum(function (d) {
                return (d.value)
            })
            .style("stroke", "none")
            .style("fill", "red")
            .attr("d", area()
                .x0(function (d) {
                    return (xNum(-d[1] / 2))
                })
                .x1(function (d) {
                    return (xNum(0))
                })
                .y(function (d) {
                    return (y(d[0]))
                })
                .curve(curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
            );
        // Vertical whiskers
        g
            .append("line")
            // .datum(function(d){ return(d.extremes)})
            .attr("y1", function (d) {
                return y(d.extremes[0])
            })
            .attr("y2", function (d) {
                return y(d.quartiles[0])
            })
            .attr("x1", xNum(0))
            .attr("x2", xNum(0))
            .style("stroke", "black");
        g
            .append("line")
            .attr("y1", function (d) {
                return y(d.extremes[1])
            })
            .attr("y2", function (d) {
                return y(d.quartiles[1])
            })
            .attr("x1", xNum(0))
            .attr("x2", xNum(0))
            .style("stroke", "black");
        // Boxes
        g
            .append("rect")
            .attr("x", x.bandwidth() * .25)
            .attr("y", function (d) {
                return y(d.quartiles[1])
            })
            .attr("width", x.bandwidth() * .5)
            .attr("height", function (d) {
                return y(d.quartiles[0]) - y(d.quartiles[1])
            })
            .style("stroke", "black")
            .style("fill", "none")

    }

    // 2 functions needed for kernel density estimate
    kernelDensityEstimator(kernel, X) {
        return function (V) {
            return X.map(function (x) {
                return [x, mean(V, function (v) {
                    return kernel(x - v);
                })];
            });
        };
    }

    kernelEpanechnikov(k) {
        return function (v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }

    getData() {
        // Test data
        return "Sepal_Length,Sepal_Width,Petal_Length,Petal_Width,Species\n\
5.1,3.5,1.4,0.2,setosa\n\
4.9,3,1.4,0.2,setosa\n\
4.7,3.2,1.3,0.2,setosa\n\
4.6,3.1,1.5,0.2,setosa\n\
5,3.6,1.4,0.2,setosa\n\
5.4,3.9,1.7,0.4,setosa\n\
4.6,3.4,1.4,0.3,setosa\n\
5,3.4,1.5,0.2,setosa\n\
4.4,2.9,1.4,0.2,setosa\n\
4.9,3.1,1.5,0.1,setosa\n\
5.4,3.7,1.5,0.2,setosa\n\
4.8,3.4,1.6,0.2,setosa\n\
4.8,3,1.4,0.1,setosa\n\
4.3,3,1.1,0.1,setosa\n\
5.8,4,1.2,0.2,setosa\n\
5.7,4.4,1.5,0.4,setosa\n\
5.4,3.9,1.3,0.4,setosa\n\
5.1,3.5,1.4,0.3,setosa\n\
5.7,3.8,1.7,0.3,setosa\n\
5.1,3.8,1.5,0.3,setosa\n\
5.4,3.4,1.7,0.2,setosa\n\
5.1,3.7,1.5,0.4,setosa\n\
4.6,3.6,1,0.2,setosa\n\
5.1,3.3,1.7,0.5,setosa\n\
4.8,3.4,1.9,0.2,setosa\n\
5,3,1.6,0.2,setosa\n\
5,3.4,1.6,0.4,setosa\n\
5.2,3.5,1.5,0.2,setosa\n\
5.2,3.4,1.4,0.2,setosa\n\
4.7,3.2,1.6,0.2,setosa\n\
4.8,3.1,1.6,0.2,setosa\n\
5.4,3.4,1.5,0.4,setosa\n\
5.2,4.1,1.5,0.1,setosa\n\
5.5,4.2,1.4,0.2,setosa\n\
4.9,3.1,1.5,0.2,setosa\n\
5,3.2,1.2,0.2,setosa\n\
5.5,3.5,1.3,0.2,setosa\n\
4.9,3.6,1.4,0.1,setosa\n\
4.4,3,1.3,0.2,setosa\n\
5.1,3.4,1.5,0.2,setosa\n\
5,3.5,1.3,0.3,setosa\n\
4.5,2.3,1.3,0.3,setosa\n\
4.4,3.2,1.3,0.2,setosa\n\
5,3.5,1.6,0.6,setosa\n\
5.1,3.8,1.9,0.4,setosa\n\
4.8,3,1.4,0.3,setosa\n\
5.1,3.8,1.6,0.2,setosa\n\
4.6,3.2,1.4,0.2,setosa\n\
5.3,3.7,1.5,0.2,setosa\n\
5,3.3,1.4,0.2,setosa\n\
7,3.2,4.7,1.4,versicolor\n\
6.4,3.2,4.5,1.5,versicolor\n\
6.9,3.1,4.9,1.5,versicolor\n\
5.5,2.3,4,1.3,versicolor\n\
6.5,2.8,4.6,1.5,versicolor\n\
5.7,2.8,4.5,1.3,versicolor\n\
6.3,3.3,4.7,1.6,versicolor\n\
4.9,2.4,3.3,1,versicolor\n\
6.6,2.9,4.6,1.3,versicolor\n\
5.2,2.7,3.9,1.4,versicolor\n\
5,2,3.5,1,versicolor\n\
5.9,3,4.2,1.5,versicolor\n\
6,2.2,4,1,versicolor\n\
6.1,2.9,4.7,1.4,versicolor\n\
5.6,2.9,3.6,1.3,versicolor\n\
6.7,3.1,4.4,1.4,versicolor\n\
5.6,3,4.5,1.5,versicolor\n\
5.8,2.7,4.1,1,versicolor\n\
6.2,2.2,4.5,1.5,versicolor\n\
5.6,2.5,3.9,1.1,versicolor\n\
5.9,3.2,4.8,1.8,versicolor\n\
6.1,2.8,4,1.3,versicolor\n\
6.3,2.5,4.9,1.5,versicolor\n\
6.1,2.8,4.7,1.2,versicolor\n\
6.4,2.9,4.3,1.3,versicolor\n\
6.6,3,4.4,1.4,versicolor\n\
6.8,2.8,4.8,1.4,versicolor\n\
6.7,3,5,1.7,versicolor\n\
6,2.9,4.5,1.5,versicolor\n\
5.7,2.6,3.5,1,versicolor\n\
5.5,2.4,3.8,1.1,versicolor\n\
5.5,2.4,3.7,1,versicolor\n\
5.8,2.7,3.9,1.2,versicolor\n\
6,2.7,5.1,1.6,versicolor\n\
5.4,3,4.5,1.5,versicolor\n\
6,3.4,4.5,1.6,versicolor\n\
6.7,3.1,4.7,1.5,versicolor\n\
6.3,2.3,4.4,1.3,versicolor\n\
5.6,3,4.1,1.3,versicolor\n\
5.5,2.5,4,1.3,versicolor\n\
5.5,2.6,4.4,1.2,versicolor\n\
6.1,3,4.6,1.4,versicolor\n\
5.8,2.6,4,1.2,versicolor\n\
5,2.3,3.3,1,versicolor\n\
5.6,2.7,4.2,1.3,versicolor\n\
5.7,3,4.2,1.2,versicolor\n\
5.7,2.9,4.2,1.3,versicolor\n\
6.2,2.9,4.3,1.3,versicolor\n\
5.1,2.5,3,1.1,versicolor\n\
5.7,2.8,4.1,1.3,versicolor\n\
6.3,3.3,6,2.5,virginica\n\
5.8,2.7,5.1,1.9,virginica\n\
7.1,3,5.9,2.1,virginica\n\
6.3,2.9,5.6,1.8,virginica\n\
6.5,3,5.8,2.2,virginica\n\
7.6,3,6.6,2.1,virginica\n\
4.9,2.5,4.5,1.7,virginica\n\
7.3,2.9,6.3,1.8,virginica\n\
6.7,2.5,5.8,1.8,virginica\n\
7.2,3.6,6.1,2.5,virginica\n\
6.5,3.2,5.1,2,virginica\n\
6.4,2.7,5.3,1.9,virginica\n\
6.8,3,5.5,2.1,virginica\n\
5.7,2.5,5,2,virginica\n\
5.8,2.8,5.1,2.4,virginica\n\
6.4,3.2,5.3,2.3,virginica\n\
6.5,3,5.5,1.8,virginica\n\
7.7,3.8,6.7,2.2,virginica\n\
7.7,2.6,6.9,2.3,virginica\n\
6,2.2,5,1.5,virginica\n\
6.9,3.2,5.7,2.3,virginica\n\
5.6,2.8,4.9,2,virginica\n\
7.7,2.8,6.7,2,virginica\n\
6.3,2.7,4.9,1.8,virginica\n\
6.7,3.3,5.7,2.1,virginica\n\
7.2,3.2,6,1.8,virginica\n\
6.2,2.8,4.8,1.8,virginica\n\
6.1,3,4.9,1.8,virginica\n\
6.4,2.8,5.6,2.1,virginica\n\
7.2,3,5.8,1.6,virginica\n\
7.4,2.8,6.1,1.9,virginica\n\
7.9,3.8,6.4,2,virginica\n\
6.4,2.8,5.6,2.2,virginica\n\
6.3,2.8,5.1,1.5,virginica\n\
6.1,2.6,5.6,1.4,virginica\n\
7.7,3,6.1,2.3,virginica\n\
6.3,3.4,5.6,2.4,virginica\n\
6.4,3.1,5.5,1.8,virginica\n\
6,3,4.8,1.8,virginica\n\
6.9,3.1,5.4,2.1,virginica\n\
6.7,3.1,5.6,2.4,virginica\n\
6.9,3.1,5.1,2.3,virginica\n\
5.8,2.7,5.1,1.9,virginica\n\
6.8,3.2,5.9,2.3,virginica\n\
6.7,3.3,5.7,2.5,virginica\n\
6.7,3,5.2,2.3,virginica\n\
6.3,2.5,5,1.9,virginica\n\
6.5,3,5.2,2,virginica\n\
6.2,3.4,5.4,2.3,virginica\n\
5.9,3,5.1,1.8,virginica";
    }
}
