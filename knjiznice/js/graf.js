const dataSource = {
  chart: {
    caption: "Mladi in kajenje",
    yaxisname: "% mladih, ki kadijo",
    subcaption: "2015-2018",
    showhovereffect: "1",
    numbersuffix: "%",
    drawcrossline: "1",
    plottooltext: "<b>$dataValue</b> mladih je kadilo $seriesName",
    theme: "fusion"
  },
  categories: [
    {
      category: [
        {
          label: "2015"
        },
        {
          label: "2016"
        },
        {
          label: "2017"
        },
        {
          label: "2018"
        },
      ]
    }
  ],
  dataset: [
    {
      seriesname: "Tobačni izdelki",
      data: [
        {
          value: "24.2"
        },
        {
          value: "25.1"
        },
        {
          value: "26.7"
        },
        {
          value: "27.1"
        },
      ]
    },
    {
      seriesname: "E-cigarete",
      data: [
        {
          value: "10"
        },
        {
          value: "14.8"
        },
        {
          value: "16"
        },
        {
          value: "19.5"
        },
        
      ]
    },
    {
      seriesname: "Cigarete",
      data: [
        {
          value: "6"
        },
        {
          value: "5.6"
        },
        {
          value: "6.8"
        },
        {
          value: "7"
        },
       
      ]
    },
    {
      seriesname: "Rezani tobak",
      data: [
        {
          value: "3.9"
        },
        {
          value: "7"
        },
        {
          value: "9"
        },
        {
          value: "11"
        },
      ]
    }
  ]
};

FusionCharts.ready(function() {
  var myChart = new FusionCharts({
    type: "msline",
    renderAt: "chart-container",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource
  }).render();
});