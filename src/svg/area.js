import {dataJoin} from 'd3fc-data-join';
import {area as areaShape} from 'd3-shape';
import {select} from 'd3-selection';
import {rebind, exclude, rebindAll} from 'd3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

export default () => {
    const base = xyBase();

    const areaData = areaShape()
        .defined(base.defined);

    const join = dataJoin('path', 'area');

    const area = (selection) => {
        selection.each((data, index, group) => {

            const projectedData = data.map(base.values);
            areaData.x((_, i) => projectedData[i].transposedX)
                .y((_, i) => projectedData[i].transposedY);

            const valueComponent = base.orient() === 'vertical' ? 'y' : 'x';
            areaData[valueComponent + '0']((_, i) => projectedData[i].y0);
            areaData[valueComponent + '1']((_, i) => projectedData[i].y);

            const path = join(select(group[index]), [data]);
            path.attr('d', areaData)
                .attr('fill', colors.gray);
            base.decorate()(path, data, index);
        });
    };

    rebind(area, base, 'xScale', 'xValue', 'yScale', 'yValue', 'y0Value', 'orient', 'decorate');
    rebind(area, dataJoin, 'key');
    rebind(area, areaData, 'curve');

    return area;
};
