import { dataJoin } from 'd3fc-data-join';
import { shapeBar } from 'd3fc-shape';
import { select } from 'd3-selection';
import xyBase from '../xyBase';
import { rebind, rebindAll } from 'd3fc-rebind';
import colors from '../colors';

export default () => {

    const pathGenerator = shapeBar()
        .x(0)
        .y(0);

    const base = xyBase();

    const join = dataJoin('g', 'bar');

    const valueAxisDimension = (generator) =>
        base.orient() === 'vertical' ? generator.height : generator.width;

    const crossAxisDimension = (generator) =>
        base.orient() === 'vertical' ? generator.width : generator.height;

    const translation = (origin) =>
        'translate(' + origin[0] + ', ' + origin[1] + ')';

    const bar = (selection) => {
        selection.each((data, index, group) => {

            const orient = base.orient();
            if (orient !== 'vertical' && orient !== 'horizontal') {
                throw new Error('The bar series does not support an orientation of ' + orient);
            }

            const filteredData = data.filter(base.defined);
            const projectedData = filteredData.map(base.values);

            pathGenerator.width(0)
                .height(0);

            if (base.orient() === 'vertical') {
                pathGenerator.verticalAlign('top');
            } else {
                pathGenerator.horizontalAlign('right');
            }

            // set the width of the bars
            const width = base.barWidth()(projectedData.map(d => d.x));
            crossAxisDimension(pathGenerator)(width);

            const g = join(select(group[index]), filteredData);

            // within the enter selection the pathGenerator creates a zero
            // height bar on the baseline. As a result, when used with a transition the bar grows
            // from y0 to y1 (y)
            g.enter()
                .attr('transform', (_, i) => translation(projectedData[i].baseOrigin))
                .attr('class', 'bar ' + base.orient())
                .attr('fill', colors.darkGray)
                .append('path')
                .attr('d', (d) => pathGenerator([d]));

            // set the bar to its correct height
            valueAxisDimension(pathGenerator)((_, i) => -projectedData[i].height);

            // the container translation sets the origin to the 'tip'
            // of each bar as per the decorate pattern
            g.attr('transform', (_, i) => translation(projectedData[i].origin))
                .select('path')
                .attr('d', (d) => pathGenerator([d]));

            base.decorate()(g, filteredData, index);
        });
    };

    rebind(bar, base, 'xScale', 'xValue', 'yScale', 'yValue', 'y0Value', 'orient', 'decorate', 'barWidth');
    rebind(bar, join, 'key');

    return bar;
};
