import {scaleIdentity} from 'd3-scale';

export default () => {

    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let series = [];
    let mapping = (d) => d;
    let key = (_, i) => i;

    const multi = () => {};

    multi.mapping = (...args) => {
        if (!args.length) {
            return mapping;
        }
        mapping = args[0];
        return multi;
    };
    multi.key = (...args) => {
        if (!args.length) {
            return key;
        }
        key = args[0];
        return multi;
    };
    multi.series = (...args) => {
        if (!args.length) {
            return series;
        }
        series = args[0];
        return multi;
    };
    multi.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return multi;
    };
    multi.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return multi;
    };

    return multi;
};
