/*
 * TOOLTIP HANDLING
 * Since this is not the focus of this example, I moved the
 * tooltip code to a separate file.
 *
 * This function creates svg text as a tooltip for a specified
 * node. The node must have the tooltip text as the id. Works
 * with both circles and rects.
 *
 *  This is pretty ugly code. I'm sorry.
 */
function show_tooltip(g, node) {
  // get bounding box of group BEFORE adding text
  var gbox = g.node().getBBox();

  // get bounding box of node
  var nbox = node.node().getBBox();

  // calculate shift amount
  var shift_x = nbox.width / 2;
  var shift_y = nbox.height / 2;

  // retrieve node attributes (calculate middle point)
  var x = nbox.x + shift_x;
  var y = nbox.y + shift_y;

  var text = node.attr("id");

  // create tooltip
  var tooltip = g.append("text")
    .text(text)
    .attr("x", x)
    .attr("y", y)
    .attr("dy", -shift_y - 4) // shift upward above circle
    .attr("text-anchor", "middle") // anchor in the middle
    .attr("id", "tooltip");

  // set tooltip style
  tooltip.style("font-size", "10pt")
    .style("font-weight", "900")
    .style("fill", "black")
    .style("stroke", "white")
    .style("stroke-width", "0.25px");

  // it is possible the tooltip will fall off the edge of the
  // plot area. we can detect when this happens, and set the
  // text anchor appropriately

  // get bounding box for the text
  var tbox = tooltip.node().getBBox();

  // if text will fall off left side, anchor at start
  if (tbox.x < gbox.x) {
    tooltip.attr("text-anchor", "start");
    tooltip.attr("dx", -shift_x); // nudge text over from center
  }
  // if text will fall off right side, anchor at end
  else if ((tbox.x + tbox.width) > (gbox.x + gbox.width)) {
    tooltip.attr("text-anchor", "end");
    tooltip.attr("dx", shift_x);
  }

  // if text will fall off top side, place below circle instead
  if (tbox.y < gbox.y) {
    tooltip.attr("dy", shift_y + tbox.height);
  }
}
