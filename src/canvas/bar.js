import {shapeBar} from 'd3fc-shape';
import {rebind, exclude, rebindAll} from 'd3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

export default () => {
    const base = xyBase();

    const pathGenerator = shapeBar()
        .x(0)
        .y(0);

    const valueAxisDimension = (generator) =>
        base.orient() === 'vertical' ? generator.height : generator.width;

    const crossAxisDimension = (generator) =>
        base.orient() === 'vertical' ? generator.width : generator.height;

    const area = (data) => {
        const context = pathGenerator.context();

        const filteredData = data.filter(base.defined);
        const projectedData = filteredData.map(base.values);

        const width = base.barWidth()(projectedData.map(d => d.x));
        crossAxisDimension(pathGenerator)(width);

        if (base.orient() === 'vertical') {
            pathGenerator.verticalAlign('top');
            pathGenerator.horizontalAlign('center');
        } else {
            pathGenerator.horizontalAlign('right');
            pathGenerator.verticalAlign('center');
        }

        projectedData.forEach((datum, i) => {
            context.save();
            context.beginPath();
            context.translate(datum.baseOrigin[0], datum.baseOrigin[1]);

            valueAxisDimension(pathGenerator)(datum.height);
            pathGenerator([datum]);

            context.fillStyle = colors.darkGray;
            base.decorate()(context, datum, i);
            context.fill();

            context.closePath();
            context.restore();
        });
    };

    rebind(area, base, 'xScale', 'xValue', 'yScale', 'yValue', 'y0Value', 'orient', 'decorate', 'barWidth');
    rebind(area, pathGenerator, 'context');

    return area;
};
