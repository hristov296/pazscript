(function($) {
  $(document).ready(function() {
    $(".show-chart").each(function(i, el) {
      $(this).click(function() {
        $(".main-list li a").removeClass("active");
        $(this)
          .siblings("a")
          .addClass("active");
        b = [plots[i].ploty1, plots[i].ploty2];
        c = plots[i].plotx;
        $("#canvas").plot(b, {
          xaxis: {
            ticks: c,
          },
          grid: {
            hoverable: true,
            clickable: true,
            mouseActiveRadius: 20,
            autoHighlight: true,
          },
          crosshair: {
            mode: "x",
            color: "#fff",
          },
          series: {
            lines: {
              show: true,
            },
            points: {
              show: true,
            },
          },
        });
      });
    });
  });
})(jQuery);
