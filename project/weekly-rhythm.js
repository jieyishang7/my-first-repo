// Mapping My Weekly Rhythm
// Three D3 sketches: weekly schedule, energy heatmap, and category summary.

(function() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const colors = {
    Sleep: "#7a35ff",
    Class: "#00e5ff",
    Homework: "#ff2bd6",
    Commute: "#00a8ff",
    Meal: "#ff8a00",
    Walk: "#00ffb3",
    Museum: "#ff477e",
    Exercise: "#00e5ff",
    Entertainment: "#ffe600",
    Personal: "#7a35ff",
    "Family call time": "#00a8ff",
    Makeup: "#ff2bd6",
    Housework: "#ff8a00",
    Reading: "#00ffb3"
  };

  const cyberpunkGradient = d3.interpolateRgbBasis([
    "#050b24",
    "#063b8f",
    "#008cff",
    "#00e5ff",
    "#d7ff00",
    "#fff700"
  ]);

  const labelColor = "#f6f7ff";

  const schedule = [
    { day: "Monday", start: 2, end: 8, activity: "Sleep", category: "Sleep" },
    { day: "Monday", start: 10, end: 11, activity: "Reading", category: "Reading" },
    { day: "Monday", start: 11, end: 11.33, activity: "Breakfast", category: "Meal" },
    { day: "Monday", start: 11.33, end: 11.67, activity: "Makeup", category: "Makeup" },
    { day: "Monday", start: 11.67, end: 12, activity: "Walk to school", category: "Commute" },
    { day: "Monday", start: 12, end: 16, activity: "Methods as Practices", category: "Class" },
    { day: "Monday", start: 16.5, end: 17.5, activity: "Meal", category: "Meal" },
    { day: "Monday", start: 17.5, end: 18.1, activity: "Walk around", category: "Walk" },
    { day: "Monday", start: 18.5, end: 20.5, activity: "Computational Design Workflow", category: "Class" },
    { day: "Monday", start: 20.5, end: 20.83, activity: "Walk home", category: "Commute" },
    { day: "Monday", start: 21, end: 21.67, activity: "Exercise", category: "Exercise" },
    { day: "Monday", start: 21.75, end: 22.75, activity: "Dinner / snack", category: "Meal" },
    { day: "Monday", start: 22.75, end: 26, activity: "Homework", category: "Homework" },

    { day: "Tuesday", start: 2, end: 10, activity: "Sleep", category: "Sleep" },
    { day: "Tuesday", start: 11, end: 11.33, activity: "Breakfast", category: "Meal" },
    { day: "Tuesday", start: 11.33, end: 11.67, activity: "Makeup", category: "Makeup" },
    { day: "Tuesday", start: 11.67, end: 12, activity: "Walk to school", category: "Commute" },
    { day: "Tuesday", start: 12, end: 14, activity: "MSCDP Lecture", category: "Class" },
    { day: "Tuesday", start: 14, end: 15, activity: "Meal", category: "Meal" },
    { day: "Tuesday", start: 15, end: 18, activity: "Museum", category: "Museum" },
    { day: "Tuesday", start: 18.67, end: 19, activity: "Go home", category: "Commute" },
    { day: "Tuesday", start: 19, end: 21, activity: "Homework", category: "Homework" },
    { day: "Tuesday", start: 21, end: 21.67, activity: "Exercise", category: "Exercise" },
    { day: "Tuesday", start: 21.67, end: 23, activity: "Homework", category: "Homework" },
    { day: "Tuesday", start: 23, end: 23.33, activity: "Family call time", category: "Family call time" },
    { day: "Tuesday", start: 23.33, end: 26, activity: "Homework", category: "Homework" },

    { day: "Wednesday", start: 2, end: 8, activity: "Sleep", category: "Sleep" },
    { day: "Wednesday", start: 8, end: 8.33, activity: "Breakfast", category: "Meal" },
    { day: "Wednesday", start: 8.33, end: 8.67, activity: "Makeup", category: "Makeup" },
    { day: "Wednesday", start: 8.67, end: 9, activity: "Walk to school", category: "Commute" },
    { day: "Wednesday", start: 9, end: 11, activity: "Computational Modeling", category: "Class" },
    { day: "Wednesday", start: 11, end: 13, activity: "Mapping System", category: "Class" },
    { day: "Wednesday", start: 13, end: 14, activity: "Meal", category: "Meal" },
    { day: "Wednesday", start: 14, end: 14.33, activity: "Walk home", category: "Commute" },
    { day: "Wednesday", start: 15, end: 19.2, activity: "Homework", category: "Homework" },
    { day: "Wednesday", start: 19.2, end: 20.2, activity: "Dinner", category: "Meal" },
    { day: "Wednesday", start: 20.2, end: 21, activity: "Homework", category: "Homework" },
    { day: "Wednesday", start: 21, end: 21.67, activity: "Exercise", category: "Exercise" },
    { day: "Wednesday", start: 21.67, end: 23, activity: "Homework", category: "Homework" },
    { day: "Wednesday", start: 23, end: 23.33, activity: "Family call time", category: "Family call time" },
    { day: "Wednesday", start: 23.33, end: 26, activity: "Homework", category: "Homework" },

    { day: "Thursday", start: 2, end: 8, activity: "Sleep", category: "Sleep" },
    { day: "Thursday", start: 10, end: 11, activity: "Reading", category: "Reading" },
    { day: "Thursday", start: 11, end: 11.33, activity: "Breakfast", category: "Meal" },
    { day: "Thursday", start: 11.33, end: 11.67, activity: "Makeup", category: "Makeup" },
    { day: "Thursday", start: 11.67, end: 12, activity: "Walk to school", category: "Commute" },
    { day: "Thursday", start: 12, end: 16, activity: "Methods as Practices", category: "Class" },
    { day: "Thursday", start: 16.5, end: 17.5, activity: "Meal", category: "Meal" },
    { day: "Thursday", start: 17.5, end: 18.1, activity: "Walk around", category: "Walk" },
    { day: "Thursday", start: 18.5, end: 20.5, activity: "Computational Design Workflow", category: "Class" },
    { day: "Thursday", start: 20.5, end: 20.83, activity: "Walk home", category: "Commute" },
    { day: "Thursday", start: 21, end: 21.67, activity: "Exercise", category: "Exercise" },
    { day: "Thursday", start: 21.75, end: 22.75, activity: "Dinner / snack", category: "Meal" },
    { day: "Thursday", start: 22.75, end: 26, activity: "Homework", category: "Homework" },

    { day: "Friday", start: 2, end: 8, activity: "Sleep", category: "Sleep" },
    { day: "Friday", start: 8, end: 8.33, activity: "Breakfast", category: "Meal" },
    { day: "Friday", start: 8.33, end: 8.67, activity: "Makeup", category: "Makeup" },
    { day: "Friday", start: 8.67, end: 9, activity: "Walk to school", category: "Commute" },
    { day: "Friday", start: 9, end: 11, activity: "Computational Modeling", category: "Class" },
    { day: "Friday", start: 11, end: 13, activity: "Mapping System", category: "Class" },
    { day: "Friday", start: 13, end: 14, activity: "Meal", category: "Meal" },
    { day: "Friday", start: 14, end: 14.33, activity: "Walk home", category: "Commute" },
    { day: "Friday", start: 15, end: 18, activity: "Homework", category: "Homework" },
    { day: "Friday", start: 19, end: 23, activity: "Shopping / entertainment", category: "Entertainment" },
    { day: "Friday", start: 23, end: 26, activity: "Personal time", category: "Personal" },

    { day: "Saturday", start: 2, end: 10, activity: "Sleep", category: "Sleep" },
    { day: "Saturday", start: 10, end: 10.33, activity: "Breakfast", category: "Meal" },
    { day: "Saturday", start: 10.33, end: 11, activity: "Makeup", category: "Makeup" },
    { day: "Saturday", start: 11, end: 12, activity: "Housework / cleaning", category: "Housework" },
    { day: "Saturday", start: 12, end: 14, activity: "Central Park / going out", category: "Walk" },
    { day: "Saturday", start: 14, end: 15, activity: "Meal", category: "Meal" },
    { day: "Saturday", start: 15, end: 22, activity: "Entertainment / shopping", category: "Entertainment" },
    { day: "Saturday", start: 22, end: 23, activity: "Homework", category: "Homework" },
    { day: "Saturday", start: 23, end: 23.33, activity: "Family call time", category: "Family call time" },
    { day: "Saturday", start: 23.33, end: 26, activity: "Homework", category: "Homework" },

    { day: "Sunday", start: 2, end: 10, activity: "Sleep", category: "Sleep" },
    { day: "Sunday", start: 10, end: 10.33, activity: "Breakfast", category: "Meal" },
    { day: "Sunday", start: 10.33, end: 11, activity: "Makeup", category: "Makeup" },
    { day: "Sunday", start: 11, end: 14, activity: "Homework", category: "Homework" },
    { day: "Sunday", start: 14, end: 15, activity: "Meal", category: "Meal" },
    { day: "Sunday", start: 15, end: 19, activity: "Homework", category: "Homework" },
    { day: "Sunday", start: 19, end: 20, activity: "Dinner", category: "Meal" },
    { day: "Sunday", start: 20, end: 26, activity: "Homework", category: "Homework" }
  ];

  const energyByCategory = {
    Sleep: 10,
    Class: 82,
    Homework: 72,
    Commute: 42,
    Meal: 48,
    Walk: 68,
    Museum: 78,
    Exercise: 86,
    Entertainment: 80,
    Personal: 55,
    "Family call time": 58,
    Makeup: 50,
    Housework: 62,
    Reading: 66
  };

  const filters = [
    { id: "all", label: "All", categories: null },
    { id: "study", label: "Study", categories: ["Class", "Homework", "Reading"] },
    { id: "rest", label: "Rest", categories: ["Sleep", "Meal", "Exercise", "Personal", "Family call time", "Makeup", "Housework", "Commute"] },
    { id: "entertainment", label: "Entertainment", categories: ["Entertainment", "Museum", "Walk"] }
  ];

  const shortLabels = {
    "Computational Design Workflow": "CDW",
    "Computational Modeling": "Modeling",
    "Methods as Practices": "Methods",
    "Mapping System": "Mapping",
    "MSCDP Lecture": "Lecture",
    "Central Park / going out": "Park",
    "Shopping / entertainment": "Entertainment",
    "Entertainment / shopping": "Entertainment",
    "Housework / cleaning": "Housework",
    "Dinner / snack": "Dinner",
    "Family call time": "Family call"
  };

  function labelFor(d) {
    return shortLabels[d.activity] || d.activity;
  }

  const formatHour = hour => {
    const normalized = ((hour % 24) + 24) % 24;
    const whole = Math.floor(normalized);
    const minutes = Math.round((normalized - whole) * 60);
    return `${String(whole).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  function tooltip(containerId) {
    return d3.select(containerId)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(5, 5, 16, 0.96)")
      .style("color", "#f6f7ff")
      .style("padding", "10px 12px")
      .style("border", "1px solid #00e5ff")
      .style("border-radius", "8px")
      .style("box-shadow", "0 0 24px rgba(0, 229, 255, 0.35), 0 0 12px rgba(255, 43, 214, 0.3)")
      .style("font-size", "12px")
      .style("font-family", "'Roboto', sans-serif")
      .style("line-height", "1.45")
      .style("pointer-events", "none")
      .style("opacity", 0);
  }

  function drawSchedule() {
    const margin = { top: 36, right: 24, bottom: 44, left: 92 };
    const width = 800 - margin.left - margin.right;
    const height = 380 - margin.top - margin.bottom;
    const tip = tooltip("#d3-container-1");
    const container = d3.select("#d3-container-1");

    const controls = container
      .append("div")
      .attr("class", "filter-controls");

    controls.selectAll("button")
      .data(filters)
      .enter()
      .append("button")
      .attr("type", "button")
      .attr("class", d => d.id === "all" ? "filter-button active" : "filter-button")
      .text(d => d.label)
      .on("click", function(event, d) {
        controls.selectAll("button").classed("active", false);
        d3.select(this).classed("active", true);
        updateSchedule(d);
      });

    const svg = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("font-family", "'Roboto', sans-serif")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear().domain([0, 26]).range([0, width]);
    const y = d3.scaleBand().domain(days).range([0, height]).padding(0.18);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickValues(d3.range(0, 27, 2)).tickFormat(formatHour))
      .selectAll("text")
      .style("font-size", "11px");

    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px");

    svg.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(d3.range(0, 27, 2))
      .enter()
      .append("line")
      .attr("x1", d => x(d))
      .attr("x2", d => x(d))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "rgba(0, 229, 255, 0.12)");

    const blockLayer = svg.append("g").attr("class", "schedule-block-layer");
    const labelLayer = svg.append("g").attr("class", "schedule-label-layer");

    function key(d) {
      return `${d.day}-${d.start}-${d.end}-${d.activity}`;
    }

    function filteredData(filter) {
      return schedule
        .filter(d => d.end > 0)
        .filter(d => !filter.categories || filter.categories.includes(d.category));
    }

    function updateSchedule(filter) {
      const currentData = filteredData(filter);

      blockLayer.selectAll(".schedule-block")
        .data(currentData, key)
        .join(
          enter => enter
            .append("rect")
            .attr("class", "schedule-block")
            .attr("x", d => x(Math.max(d.start, 0)))
            .attr("y", d => y(d.day))
            .attr("width", d => Math.max(3, x(d.end) - x(Math.max(d.start, 0))))
            .attr("height", y.bandwidth())
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("fill", d => colors[d.category])
            .attr("stroke", "rgba(246, 247, 255, 0.38)")
            .attr("stroke-width", 0.7)
            .attr("opacity", 0)
            .call(enter => enter.transition().duration(240).attr("opacity", 0.86)),
          update => update
            .call(update => update.transition().duration(240)
              .attr("x", d => x(Math.max(d.start, 0)))
              .attr("y", d => y(d.day))
              .attr("width", d => Math.max(3, x(d.end) - x(Math.max(d.start, 0))))
              .attr("height", y.bandwidth())
              .attr("fill", d => colors[d.category])
              .attr("opacity", 0.86)),
          exit => exit
            .call(exit => exit.transition().duration(180).attr("opacity", 0).remove())
        )
        .on("mouseover", function(event, d) {
          const hoverColor = d3.color(colors[d.category]).brighter(0.35).formatHex();
          d3.select(this)
            .raise()
            .transition()
            .duration(160)
            .attr("fill", hoverColor)
            .attr("y", y(d.day) - 2)
            .attr("height", y.bandwidth() + 4)
            .attr("opacity", 1);

          tip.style("opacity", 1)
            .html(`<strong>${d.activity}</strong><br>${d.day}<br>${formatHour(d.start)}-${formatHour(d.end)}<br>${d.category}`)
            .style("left", `${event.offsetX + 12}px`)
            .style("top", `${event.offsetY + 12}px`);
        })
        .on("mousemove", function(event) {
          tip.style("left", `${event.offsetX + 12}px`)
            .style("top", `${event.offsetY + 12}px`);
        })
        .on("mouseout", function(event, d) {
          d3.select(this)
            .transition()
            .duration(160)
            .attr("fill", colors[d.category])
            .attr("y", y(d.day))
            .attr("height", y.bandwidth())
            .attr("opacity", 0.86);
          tip.style("opacity", 0);
        });

      labelLayer.selectAll(".schedule-label")
        .data(currentData.filter(d => d.end - Math.max(d.start, 0) >= 1.8), key)
        .join(
          enter => enter
            .append("text")
            .attr("class", "schedule-label")
            .attr("x", d => x(Math.max(d.start, 0)) + 5)
            .attr("y", d => y(d.day) + y.bandwidth() / 2 + 4)
            .style("font-size", "10px")
            .style("font-weight", "700")
            .style("fill", labelColor)
            .style("pointer-events", "none")
            .style("opacity", 0)
            .text(labelFor)
            .call(enter => enter.transition().duration(240).style("opacity", 1)),
          update => update
            .text(labelFor)
            .call(update => update.transition().duration(240)
              .attr("x", d => x(Math.max(d.start, 0)) + 5)
              .attr("y", d => y(d.day) + y.bandwidth() / 2 + 4)
              .style("opacity", 1)),
          exit => exit
            .call(exit => exit.transition().duration(180).style("opacity", 0).remove())
        );
    }

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -14)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "700")
      .text("A Typical Week, 00:00 to 02:00 Next Day");

    updateSchedule(filters[0]);
  }

  function drawEnergyHeatmap() {
    const margin = { top: 34, right: 22, bottom: 48, left: 92 };
    const cellSize = 26;
    const hours = d3.range(0, 26);
    const width = cellSize * hours.length;
    const height = cellSize * days.length;
    const tip = tooltip("#d3-container-3");

    const svg = d3.select("#d3-container-3")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("font-family", "'Roboto', sans-serif")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const cells = [];
    days.forEach(day => {
      hours.forEach(hour => {
        const active = schedule.find(d => d.day === day && d.start < hour + 1 && d.end > hour);
        const category = active ? active.category : "Personal";
        const lateBoost = hour >= 22 && category === "Homework" ? 10 : 0;
        cells.push({
          day,
          hour,
          activity: active ? active.activity : "Open time",
          category,
          value: Math.min(100, (energyByCategory[category] || 45) + lateBoost)
        });
      });
    });

    const color = d3.scaleSequential(cyberpunkGradient).domain([10, 100]);

    svg.selectAll(".energy-cell")
      .data(cells)
      .enter()
      .append("rect")
      .attr("class", "energy-cell")
      .attr("x", d => d.hour * cellSize)
      .attr("y", d => days.indexOf(d.day) * cellSize)
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("fill", d => color(d.value))
      .attr("stroke", "rgba(0, 229, 255, 0.18)")
      .attr("stroke-width", 0.5)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("stroke", "#00e5ff").attr("stroke-width", 1.5);
        tip.style("opacity", 1)
          .html(`<strong>${d.day}</strong><br>${formatHour(d.hour)}-${formatHour(d.hour + 1)}<br>${d.activity}<br>Energy score: ${d.value}`)
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY + 12}px`);
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke", "rgba(0, 229, 255, 0.18)").attr("stroke-width", 0.5);
        tip.style("opacity", 0);
      });

    svg.append("g")
      .selectAll("text")
      .data(days)
      .enter()
      .append("text")
      .attr("x", -8)
      .attr("y", (_, i) => i * cellSize + cellSize / 2 + 4)
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .text(d => d);

    svg.append("g")
      .selectAll("text")
      .data(hours.filter(h => h % 2 === 0))
      .enter()
      .append("text")
      .attr("x", d => d * cellSize)
      .attr("y", height + 20)
      .style("font-size", "11px")
      .text(formatHour);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -14)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "700")
      .text("Hourly Energy and Pressure Across the Week");
  }

  function drawCategorySummary() {
    const totals = d3.rollups(
      schedule,
      values => d3.sum(values, d => d.end - d.start),
      d => d.category
    )
      .map(([category, hours]) => ({ category, hours }))
      .sort((a, b) => b.hours - a.hours);

    const margin = { top: 34, right: 40, bottom: 36, left: 92 };
    const width = 800 - margin.left - margin.right;
    const height = 360 - margin.top - margin.bottom;
    const tip = tooltip("#d3-container-2");

    const svg = d3.select("#d3-container-2")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("font-family", "'Roboto', sans-serif")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(totals, d => d.hours)])
      .nice()
      .range([0, width]);
    const y = d3.scaleBand()
      .domain(totals.map(d => d.category))
      .range([0, height])
      .padding(0.22);

    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px");

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => `${d}h`))
      .selectAll("text")
      .style("font-size", "11px");

    svg.selectAll(".summary-bar")
      .data(totals)
      .enter()
      .append("rect")
      .attr("class", "summary-bar")
      .attr("x", 0)
      .attr("y", d => y(d.category))
      .attr("width", d => x(d.hours))
      .attr("height", y.bandwidth())
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", d => colors[d.category])
      .attr("stroke", "rgba(246, 247, 255, 0.38)")
      .attr("stroke-width", 0.7)
      .attr("opacity", 0.9)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 1);
        tip.style("opacity", 1)
          .html(`<strong>${d.category}</strong><br>${d.hours.toFixed(1)} hours per week`)
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY + 12}px`);
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 0.9);
        tip.style("opacity", 0);
      });

    svg.selectAll(".summary-label")
      .data(totals)
      .enter()
      .append("text")
      .attr("x", d => x(d.hours) + 6)
      .attr("y", d => y(d.category) + y.bandwidth() / 2 + 4)
      .style("font-size", "11px")
      .style("fill", "#f6f7ff")
      .text(d => `${d.hours.toFixed(1)}h`);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -14)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "700")
      .text("Total Hours by Weekly Activity Category");
  }

  drawSchedule();
  drawEnergyHeatmap();
  drawCategorySummary();
})();
