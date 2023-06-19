import Highcharts from "highcharts";

const EngagementHelper = {
  engagementMessageOverTimeChartOptions: (messageCountList, channels) => {
    /**
     * channel and message mapping function
     * gets all the messages of a channel
     */
    const getChannelMessages = (channel) =>
      messageCountList.filter((message) => message.channelId === channel.id);

    /**
     * prepares the series data for the graph in
     * the form of data: [[x1, y1], [x2, y2]]
     *
     * 1. filters channels with messages on more than 1 date
     * 2. generates the coordinates array, [timestamp, messageCount]
     */
    const seriesData = channels
      .filter((channel) => getChannelMessages(channel).length > 1)
      .map((channel) => ({
        name: channel.name,
        data: getChannelMessages(channel).map((message) => [
          Date.parse(message.timeBucket),
          parseInt(message.count),
        ]),
      }));

    /**
     * same above functionality with just one iteration
     */
    // const seriesData = channels
    //   .map((channel) => {
    //     const channelMessage = getChannelMessages(channel);
    //     if (channelMessage.length > 1) {
    //       return {
    //         name: channel.name,
    //         data: channelMessage.map((message) => [
    //           Date.parse(message.timeBucket),
    //           parseInt(message.count),
    //         ]),
    //       };
    //     }
    //     return null;
    //   })
    //   .filter((channel) => !!channel);

    // Prepare the options for Highcharts
    const options = {
      chart: {
        type: "spline",
      },
      title: {
        text: "Engagement Messages Over Time",
      },
      xAxis: {
        type: "datetime",
        tickInterval: 24 * 3600 * 1000,
      },
      yAxis: {
        title: {
          text: "Message Count",
        },
      },
      tooltip: {
        formatter: function () {
          return `<b>${this.series.name}</b><br/>${this.y} message${
            this.y > 1 ? "s" : ""
          } on ${Highcharts.dateFormat("%d %b", this.x)}`;
        },
      },
      series: seriesData,
    };

    return options;
  },
};

export default EngagementHelper;
