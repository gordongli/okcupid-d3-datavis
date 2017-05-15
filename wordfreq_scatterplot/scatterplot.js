var margin = {top: 30, right: 25, bottom: 30, left: 35},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scaleLog()
    .range([0, width]);
var y = d3.scaleLog()
    .range([height, 10]);

// var color = d3.scaleOrdinal(d3.schemeCategory10);
var xAxis = d3.axisBottom(x).ticks(10, ".0%");
var yAxis = d3.axisLeft(y).ticks(10, ".0%");
var color = d3.scaleSequential(d3.interpolateRdYlBu);
// console.log(d3.interpolateRdBu);
// color.range(d3.schemeRdBu);

var g = d3.select("div#vis").append("svg")
    .attr("class", "scatter")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("class", "plot")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// rect to allow zoom all over
g.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");

// clip path for zoom
var clipPath = g.append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height);

const main = g.append('g')
  .attr('class', 'main')
  .attr('clip-path', 'url(#clip)');


var scale = 1;

    var zoom = d3.zoom()
        .scaleExtent([1, 10])
        .translateExtent([[0, 0], [width + margin.left + margin.right, height + margin.top + margin.bottom]])
        // .translateExtent([[-100, -100], [width + 90, height + 100]])
        .on("zoom", zoomed);

        function zoomed() {
          // console.log("zoomed", d3.event);
          var transform = d3.event.transform;
          scale = d3.event.transform.k;
          // console.log(scale);

          var dots = d3.selectAll(".dot")
            .attr("transform", transform)
            .attr("stroke-width", 1 / scale + "px");

            dots.select("circle")
              .attr("stroke-width", 0.25 / scale + "px")
              .attr("stroke", "black")
              .attr("r", 3 / scale);

            dots.select("text")
              .attr("font-size", 12 / scale + "px")
              .attr("dx", 0.35 / scale + "em")
              .attr("dy", 0.35 / scale + "em");


          d3.select(".x-axis").call(xAxis.scale(transform.rescaleX(x)));
          d3.select(".y-axis").call(yAxis.scale(transform.rescaleY(y)));


          d3.selectAll((".dot")).filter(function(d) {
              return (d.female_male_ratio < (0.75 * scale / 4) || d.female_male_ratio > (1.75 / scale * 4)
                || (d.male_ratio > 0.5 || d.female_ratio > 0.5))
            }).classed("alwaysshow", true);

            d3.selectAll((".dot")).filter(function(d) {
              return !(d.female_male_ratio < (0.75 * scale) || d.female_male_ratio > (1.75 / scale)
                || (d.male_ratio > 0.5 || d.female_ratio > 0.5))
              // return !(d.female_male_ratio < (0.75 * scale) || d.female_male_ratio > (1.75 / scale))
                  // || d.male_ratio > 0.75 || d.female_ratio > 0.75
              }).classed("alwaysshow", false);

        }
  g.call(zoom);
  // d3.select(".plot").call(zoom);


d3.csv("tableau_mf_wordfreq_data.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.male_ratio = +d.male_ratio;
    d.female_ratio = +d.female_ratio;
  });

  x.domain(d3.extent(data, function(d) { return d.male_ratio; })).nice();
  y.domain(d3.extent(data, function(d) { return d.female_ratio; }));
  color.domain([2, 0.16]);
  // color.domain([2, 0]);
  // color.domain(d3.extent(data, function(d) { return d.female_male_ratio; })).nice();
  // color.domain(color.domain().reverse());
  console.log(color.domain());

  var gX = g.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Male Word Frequency");

  var gY = g.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Female Word Frequency")


    var dotsgroup = main.append("g")
    .attr("class", "dots");

    var dotgroup = dotsgroup.selectAll(".dot")
      .data(data)
      .enter()
      .append("g")
      .attr("id", function(d) { return "id-" + d.word; })
      // .attr("transform", function(d) { return "translate(" + d.male_ratio + "," + d.female_ratio + ")"; })
      .attr("class", "dot");

    var dotcircle = dotgroup.append("circle")
      // .attr("class", "dot")
      // .attr("r", 3)
      .attr("r", 3)
      .attr("cx", function(d) { return x(d.male_ratio); })
      .attr("cy", function(d) { return y(d.female_ratio); })
      .attr("stroke-width", 0.25 / scale + "px")
      .attr("stroke", "black")
      .style("fill-opacity", 0.8)
      .style("fill", function(d) { return color(d.female_male_ratio); });

      // how about some text labels?
    var dottext = dotgroup.append("text")
      .attr("x", function(d) { return x(d.male_ratio); })
      .attr("y", function(d) { return y(d.female_ratio); })
      .attr("dx", "0.35em")
      .attr("dy", "0.35em")
      .attr("font-size", "12px")
      .attr("text-anchor", "start")
      .text(function(d) { return d.word; });
            //  // adjust position based on location in chart
            //  .attr("dx", function(d) {
            //    var shift = scales.radius(d.earnings) + 1;
            //    return d.access > 40 ? -shift : shift;
            //  })
            //  .attr("dy", "0.35em")
            //  .attr("text-anchor", function(d) {
            //    return d.access > 40 ? "end" : "start";
            //  })
            //  .text(function(d) { return d.word; });

    // dotgroup.filter(function(d) {
    //     return (d.female_male_ratio < 0.75 || d.female_male_ratio > 1.75)
    //       || d.male_ratio > 0.75 || d.female_ratio > 0.75
    //   }).classed("alwaysshow", true);


    dotgroup.filter(function(d) {
        return (d.female_male_ratio < (0.75 / scale) || d.female_male_ratio > (1.75 / scale)
          || (d.male_ratio > 0.5 || d.female_ratio > 0.5));
      }).classed("alwaysshow", true);

    // dotcircle.on("zoom", function(d) {
    //   console.log("zoom circle");
    //   d3.select(this).attr("r", 3 / d3.event.scale);
    // });

            // too many to display at once
        // only show text labels when group is hovered
        dotgroup.on("mouseover", function(d) {
            d3.select(this).classed("hover", true);
            d3.select(this).raise();
            var radius = +d3.select(this).select("circle").attr("r");
            d3.select(this).select("circle").attr("r", radius * 2)
            d3.select(this).select("circle").attr("fill-opacity", 1);
            // d3.select(this).select("circle").classed("active", true);

            body.html("<table border=0 cellspacing=0 cellpadding=2>" + "\n" +
              "<tr><th>Word (stem):</th><td>" + d.word + "</td></tr>" + "\n" +
              "<tr><th>Male Count:</th><td>" + d3.format("d")(d.male) + "</td></tr>" + "\n" +
              "<tr><th>Female Count:</th><td>" + d3.format("d")(d.female) + "</td></tr>" + "\n" +
              "<tr><th>Male Frequency:</th><td>" + d3.format(".1%")(d.male_ratio) + "</td></tr>" + "\n" +
              "<tr><th>Female Frequency:</th><td>" + d3.format(".1%")(d.female_ratio) + "</td></tr>" + "\n" +
              "<tr><th>Female/Male Frequency:</th><td>" + d3.format(".3r")(d.female_male_ratio) + "</td></tr>" + "\n" +
              "</table>");

            details.style("visibility", "visible");


          })
          .on("mouseout", function(d, i) {
            // remove hover class
            d3.select(this).classed("hover", false);
            var radius = +d3.select(this).select("circle").attr("r");
            d3.select(this).select("circle").attr("r", radius / 2);
            d3.select(this).select("circle").attr("fill-opacity", 0.6);

            details.style("visibility", "hidden");

          });


  // add details widget
  // https://bl.ocks.org/mbostock/1424037
  var details = g.append("foreignObject")
    .attr("id", "details")
    // .attr("width", 360)
    .attr("width", 200)
    .attr("height", 150)
    .attr("x", margin.left)
    .attr("y", margin.top);
    // .attr("x", -2*margin.left)
    // .attr("y", margin.top);

  var body = details.append("xhtml:body")
    .style("text-align", "left")
    .style("background", "whitesmoke")
    .style("font-size", "10pt")
    // this is <body> too, so set the margin manually to show table correctly
    .style("margin", "0px")
    .html("<p>N/A</p>");

  details.style("visibility", "hidden");


  var plot = {
    "width": g.attr("width") - margin.left - margin.right,
    "height": g.attr("height") - margin.top - margin.bottom
  };

  var groups = {};
  var scales = {};
  var axes = {};
  scales["color"] = color;
  var legend = { "width": 100, "height": 20 };

    // lets try to make a color legend

  groups["legend"] = g.append("g")
  .attr("id", "color")
  .attr("class", "axis");

  // our color scale doesn't have an invert() function
  // and we need some way of mapping 0% and 100% to our domain
  // so we'll create a scale to reverse that mapping
  scales["percent"] = d3.scaleLinear()
  // .domain([0, 100].reverse()) // since we reversed the color
  .domain([0, 100])
  .range(scales.color.domain());

  // setup gradient for legend
  // http://bl.ocks.org/mbostock/1086421
  g.append("defs")
  .append("linearGradient")
  .attr("id", "gradient")
  .selectAll("stop")
  .data(d3.ticks(0, 100, 10))
  .enter()
  .append("stop")
  .attr("offset", function(d) {
    return d + "%";
  })
  .attr("stop-color", function(d) {
    // return color(scales.percent(d));
    return scales.color(scales.percent(d));
  });

  // draw the color rectangle with gradient
  groups.legend.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", legend.width)
  .attr("height", legend.height)
  .attr("fill", "url(#gradient)");

  // lets also draw an axis with tick marks at the top
  scales["legend"] = d3.scaleLinear()
  // .domain(scales.color.domain().reverse())
  .domain(scales.color.domain())
  .range([0, legend.width]);

  axes["legend"] = d3.axisTop(scales.legend)
  .tickValues(scales.color.domain())
  .tickFormat(d3.format(".0r"));

  groups.legend.call(axes.legend);

  // tweak the tick marks
  groups.legend.selectAll("text").each(function(d, i) {
  if (d == scales.legend.domain()[0]) {
    d3.select(this).attr("text-anchor", "start");
  }
  else if (d == scales.legend.domain()[1]) {
    d3.select(this).attr("text-anchor", "end");
  }
  });

  // add text label at the bottom
  groups.legend.append("text")
  .attr("x", legend.width / 2)
  .attr("y", legend.height)
  .attr("dx", 0)
  .attr("dy", "1em")
  .attr("text-anchor", "middle")
  .text("Female/Male Frequency");

  // shift to a nice location
  groups.legend.attr("transform", translate(width-legend.width, height-legend.height*4));
  // groups.legend.attr("transform", translate(width-legend.width, margin.top));

  /*
  * returns a translate string for the transform attribute
  */
  function translate(x, y) {
  return "translate(" + String(x) + "," + String(y) + ")";
  }



});
