export default function displayChart(maxArr, minArr) {
  var ctx = document.getElementById("myChart")
  ctx.width = 500
  ctx.height = 100
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['0', '1', '2', '3', '4', '5', '6'],
      datasets: [
        {
          data: maxArr,
          backgroundColor: 'transparent',
          pointBackgroundColor: '#ffb84f',
          borderColor: '#ffb84f',
        },
        {
          data: minArr,
          backgroundColor: 'transparent',
          pointBackgroundColor: '#4fc3f7',
          borderColor: '#4fc3f7',
        },
      ],
    },
    scaleShowLabels: false,
    options: {
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 40,
          right: 40,
        },
      },
      animation: {
        duration: 1,
        onComplete: function() {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = "#000";
          ctx.font = '14px Microsoft YaHei'
  
          this.data.datasets.forEach(function(dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            if (i === 0) {
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y - 12);
              });
            } else {
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y + 12);
              })
            }
          })
        }
      },  
      responsive: false,
      legend: {
        display: false,
      },
      scales: {
        yAxes: [{
          display: false,
        }],
        xAxes: [{
          display: false,
        }],
      },
    }
  })
}

