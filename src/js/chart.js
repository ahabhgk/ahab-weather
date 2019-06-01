var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [
          {
            data: [10, 20, 30],
            
            backgroundColor: 'transparent',
            pointBackgroundColor: '#ffb84f',
            borderColor: '#ffb84f',
          },
          {
            data: [20, 10, 30],
            backgroundColor: 'transparent',
            pointBackgroundColor: '#4fc3f7',
            borderColor: '#4fc3f7',
          }
        ]
    },
    scaleShowLabels: false,
    options: {
      animation: {
        duration: 1,
        onComplete: function() {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = "#000";
          ctx.font = '22px Microsoft YaHei'
  
          this.data.datasets.forEach(function(dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            if (i === 0) {
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y - 10);
              });
            } else {
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y + 10);
              });
            }
          });
        }
      },  
      responsive: false,
      legend: {
        display: false,
      },
        scales: {
          yAxes: [{
            display: false,
            gridLines : { 
              display : false 
            }
          }],
          xAxes: [{
            display: false,
            gridLines : { 
              display : false 
            }
          }]
        }
    }
});
