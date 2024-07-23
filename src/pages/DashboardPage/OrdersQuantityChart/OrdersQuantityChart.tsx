import React, { FC, useCallback, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Button, Box } from '@mui/material';
import { IOrder } from 'interfaces/OrderInterface';
import Colors from 'theme/colors';

interface IOrdersQuantityChartProps {
  orders: IOrder[];
}

const OrdersQuantityChart: FC<IOrdersQuantityChartProps> = ({ orders }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const generateChartOptions = useCallback((chartData: number[]) => {
    return {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Orders Quantity',
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
        crosshair: true,
      },
      yAxis: {
        min: 0,
        allowDecimals: false,
        title: {
          text: 'Quantity',
        },
      },
      colors: [Colors.PRIMARY_LIGHT],
      series: [
        {
          name: 'Orders Quantity',
          data: chartData,
        },
      ],
    };
  }, []);

  const ordersByMonthYear: Record<number, number[]> = orders.reduce(
    (acc: { [year: number]: number[] }, order) => {
      const paidDate = new Date(order.paidAt);
      const paidYear = paidDate.getFullYear();
      const paidMonth = paidDate.getMonth();
      if (!acc[paidYear]) {
        acc[paidYear] = Array(12).fill(0);
      }
      acc[paidYear][paidMonth]++;
      return acc;
    },
    {}
  );

  const chartData: number[] = ordersByMonthYear[selectedYear] || [];

  const availableYears = Object.keys(ordersByMonthYear).map(Number);
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
    <Box mb={2}>
      <HighchartsReact
        highcharts={Highcharts}
        options={generateChartOptions(chartData)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {yearButtons}
      </Box>
    </Box>
  );
};

export default OrdersQuantityChart;
