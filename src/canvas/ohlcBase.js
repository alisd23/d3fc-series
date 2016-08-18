import { shapeCandlestick } from 'd3fc-shape';
import ohlcBase from '../ohlcBase';
import { rebind, rebindAll } from 'd3fc-rebind';
import colors from '../colors';

export default (pathGenerator) => {

    const base = ohlcBase();

    const candlestick = (data) => {
        const filteredData = data.filter(base.defined);
        pathGenerator.width(base.width(filteredData));
        const context = pathGenerator.context();

        filteredData.forEach((d, i) => {
            context.save();

            const values = base.values(d, i);
            context.translate(values.x, values.yHigh);
            context.beginPath();

            pathGenerator.x(0)
                .open(() => values.yOpen - values.yHigh)
                .high(0)
                .low(() => values.yLow - values.yHigh)
                .close(() => values.yClose - values.yHigh)([d]);

            const color = values.direction === 'up' ? colors.green : colors.red;
            context.strokeStyle = color;
            context.fillStyle = color;

            base.decorate()(context, d, i);

            context.stroke();
            context.fill();
            context.closePath();

            context.restore();
        });
    };

    rebind(candlestick, pathGenerator, 'context');
    rebindAll(candlestick, base);

    return candlestick;

};
