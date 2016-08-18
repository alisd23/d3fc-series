import { dataJoin } from 'd3fc-data-join';
import { shapeCandlestick } from 'd3fc-shape';
import ohlcBase from '../ohlcBase';
import { rebind, rebindAll } from 'd3fc-rebind';
import { select } from 'd3-selection';
import colors from '../colors';

export default (pathGenerator, seriesName) => {
    const base = ohlcBase();
    const join = dataJoin('g', seriesName);
    const containerTranslation =
        (values) => 'translate(' + values.x + ', ' + values.yHigh + ')';

    const candlestick = (selection) => {
        selection.each((data, index, group) => {

            const filteredData = data.filter(base.defined);
            pathGenerator.width(base.width(filteredData));

            const g = join(select(group[index]), filteredData);

            g.enter()
                .attr('transform', (d, i) => containerTranslation(base.values(d, i)) + ' scale(1e-6, 1)')
                .append('path');

            g.each((d, i, g) => {

                const values = base.values(d, i);
                const color = values.direction === 'up' ? colors.green : colors.red;

                const singleCandlestick = select(g[i])
                    .attr('class', seriesName + ' ' + values.direction)
                    .attr('stroke', color)
                    .attr('fill', color)
                    .attr('transform', () => containerTranslation(values) + ' scale(1)');

                pathGenerator.x(0)
                    .open(() => values.yOpen - values.yHigh)
                    .high(0)
                    .low(() => values.yLow - values.yHigh)
                    .close(() => values.yClose - values.yHigh);

                singleCandlestick.select('path')
                    .attr('d', pathGenerator([d]));
            });

            base.decorate()(g, data, index);
        });
    };

    rebind(candlestick, join, 'key');
    rebindAll(candlestick, base);

    return candlestick;
};
