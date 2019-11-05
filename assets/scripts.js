(function($) {
  $(document).ready(function() {
    $items = [];
    active = -1;
    $(".show-chart").each(function(i, el) {
      $items.push(el);
      $(this).click(function() {
        changeActive(i);
      });
    });

    function changeActive(i) {
      if (i < 0 || i > $items.length - 1) {
        return;
      }
      $(".main-list li a").removeClass("active");
      $($items[i])
        .siblings("a")
        .focus()
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

      active = i;
    }

    $(window).keydown(function(e) {
      if (e.keyCode == 39 || e.keyCode == 40) {
        e.preventDefault();
        changeActive(active + 1);
      } else if (e.keyCode == 37 || e.keyCode == 38) {
        e.preventDefault();
        changeActive(active - 1);
      }
    });
  });
})(jQuery);
