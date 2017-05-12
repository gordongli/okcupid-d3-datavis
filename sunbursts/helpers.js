/*
 * Convert from degrees (e.g. 360) to radians (e.g. 2*Pi)
 */
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

/*
 * Convert from radians (e.g. 2*Pi) to degrees (e.g. 360)
 */
function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

/*
 * Convert from polar coordinates (e.g. r/radius and
 * theta/degrees) to cartesian coordinates (e.g. x and y).
 *
 * The angle provided should be in degrees, not radians!
 */
function toCartesian(r, degrees) {
    var theta = toRadians(degrees);
    var x = r * Math.cos(theta);
    var y = r * Math.sin(theta);

    return {"x": x, "y": y};
}

/*
 * Convert from cartesian coordinates (e.g. x and y) to polar
 * coordinates (e.g. r/radius and theta/degrees)
 *
 * The angle returned will be in degrees, not radians!
 */
function toPolar(x, y) {
    var r = Math.sqrt(x * x + y * y);
    var theta = Math.atan2(y, x);

    return {"r": r, "theta": toDegrees(theta)};
}

/*
 * Returns translate text for the SVG transform attribute.
 */
function translate(x, y) {
    return "translate(" + String(x) + "," + String(y) + ")";
}
