import {dataJoin} from 'd3fc-data-join';
import {line as lineShape} from 'd3-shape';
import {select} from 'd3-selection';
import {rebind, exclude, rebindAll} from 'd3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

export default () => {
    const base = xyBase();

    const lineData = lineShape()
        .defined(base.defined)
        .x((d, i) => base.values(d, i).transposedX)
        .y((d, i) => base.values(d, i).transposedY);

    const join = dataJoin('path', 'line');

    const line = (selection) => {
        selection.each((data, index, group) => {
            const path = join(select(group[index]), [data]);
            path.attr('d', lineData)
                .attr('fill', 'none')
                .attr('stroke', colors.black);
            base.decorate()(path, data, index);
        });
    };

    rebind(line, base, 'xScale', 'xValue', 'yScale', 'yValue', 'orient', 'decorate');
    rebind(line, join, 'key');
    rebind(line, lineData, 'curve');

    return line;
};
