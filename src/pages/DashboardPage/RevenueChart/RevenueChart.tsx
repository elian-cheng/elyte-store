import { Box, Button } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FC, useCallback, useState } from 'react';
import Colors from 'theme/colors';
import { IOrder } from 'interfaces/OrderInterface';
import accessibility from 'highcharts/modules/accessibility';
accessibility(Highcharts);

interface IRevenueChartProps {
  orders: IOrder[];
}

const RevenueChart: FC<IRevenueChartProps> = ({ orders }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const generateMonthlyRevenueData = useCallback(
    (orders: IOrder[], year: number) => {
      const revenueData: { [key: string]: number } = {};

      orders.forEach((order) => {
        const date = new Date(order.paidAt);
        const month = date.toLocaleString('default', { month: 'short' });
        const orderYear = date.getFullYear();
        if (orderYear === year) {
          const key = `${month}`;
          if (!revenueData[key]) {
            revenueData[key] = 0;
          }
          revenueData[key] += +order.totalPrice;
        }
      });

      return Object.keys(revenueData).map((key) => ({
        name: key,
        y: revenueData[key],
      }));
    },
    []
  );

  const generateChartOptions = useCallback(
    (orders: IOrder[]) => {
      const monthlyRevenueData = generateMonthlyRevenueData(
        orders,
        selectedYear
      );

      return {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Monthly Revenue',
        },
        xAxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Revenue ($)',
          },
        },
        colors: [Colors.PRIMARY_DARK],
        series: [
          {
            name: 'Revenue',
            data: monthlyRevenueData,
          },
        ],
        tooltip: {
          pointFormat: 'Revenue: <b>${point.y:.2f}</b>',
        },
      };
    },
    [generateMonthlyRevenueData, selectedYear]
  );

  const ordersByYear = orders.reduce(
    (acc: { [year: number]: IOrder[] }, order) => {
      const year = new Date(order.paidAt).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(order);
      return acc;
    },
    {}
  );

  const availableYears = Object.keys(ordersByYear).map(Number);
  const yearButtons = availableYears.map((year) => (
    <Button
      key={year}
      variant={year === selectedYear ? 'contained' : 'outlined'}
      onClick={() => setSelectedYear(year)}
    >
      {year}
    </Button>
  ));

  return (
    <Box my={6}>
      <HighchartsReact
        highcharts={Highcharts}
        options={generateChartOptions(orders)}
      />
      <Box
        sx={{ display: 'flex', justifyContent: 'center', gap: '1rem', mt: 2 }}
      >
        {yearButtons}
      </Box>
    </Box>
  );
};

export default RevenueChart;
