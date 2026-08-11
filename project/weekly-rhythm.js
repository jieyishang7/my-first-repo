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
      .attr("role", "tooltip");
  }

  function positionTooltip(event, tip, containerId) {
    const [x, y] = d3.pointer(event, document.querySelector(containerId));
    tip.style("left", `${x + 16}px`).style("top", `${y + 16}px`);
  }

  function chartSvg(container, viewBox) {
    return container.append("svg")
      .attr("class", "chart-svg")
      .attr("viewBox", viewBox)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("role", "img");
  }

  function drawSchedule() {
    const containerId = "#d3-container-1";
    const container = d3.select(containerId);
    const tip = tooltip(containerId);
    const width = 1000;
    const height = 790;
    const cx = 500;
    const cy = 395;
    const sunRadius = 78;
    const segmentInnerRadius = 242;
    const segmentOuterRadius = 298;
    const dialRadius = 324;
    const angle = d3.scaleLinear().domain([0, 26]).range([0, Math.PI * 2]);
    let selectedDay = days[0];
    let activeFilter = filters[0];

    const controls = container.append("div").attr("class", "solar-controls");
    const dayControls = controls.append("div").attr("class", "solar-control-group");
    dayControls.append("span").attr("class", "control-label").text("Day Channel");
    dayControls.selectAll("button")
      .data(days)
      .enter()
      .append("button")
      .attr("type", "button")
      .attr("class", d => d === selectedDay ? "day-button active" : "day-button")
      .attr("aria-pressed", d => d === selectedDay ? "true" : "false")
      .text(d => d.slice(0, 3))
      .on("click", function(event, day) {
        selectedDay = day;
        dayControls.selectAll("button").classed("active", false).attr("aria-pressed", "false");
        d3.select(this).classed("active", true).attr("aria-pressed", "true");
        updateSun();
        updateSchedule();
      });

    const filterControls = controls.append("div").attr("class", "solar-control-group");
    filterControls.append("span").attr("class", "control-label").text("Signal Filter");
    filterControls.selectAll("button")
      .data(filters)
      .enter()
      .append("button")
      .attr("type", "button")
      .attr("class", d => d.id === "all" ? "filter-button active" : "filter-button")
      .attr("aria-pressed", d => d.id === "all" ? "true" : "false")
      .text(d => d.label)
      .on("click", function(event, d) {
        activeFilter = d;
        filterControls.selectAll("button").classed("active", false).attr("aria-pressed", "false");
        d3.select(this).classed("active", true).attr("aria-pressed", "true");
        updateSchedule();
      });

    const svg = chartSvg(container, `0 0 ${width} ${height}`)
      .attr("aria-label", "Solar daily rhythm dial with activity arcs and energy rays");

    const defs = svg.append("defs");
    const sunGradient = defs.append("radialGradient").attr("id", "sun-core-gradient");
    sunGradient.append("stop").attr("offset", "0%").attr("stop-color", "#fffde7");
    sunGradient.append("stop").attr("offset", "34%").attr("stop-color", "#fff700");
    sunGradient.append("stop").attr("offset", "68%").attr("stop-color", "#ff8a00");
    sunGradient.append("stop").attr("offset", "100%").attr("stop-color", "#ff2bd6").attr("stop-opacity", .5);

    const auraGradient = defs.append("radialGradient").attr("id", "sun-aura-gradient");
    auraGradient.append("stop").attr("offset", "0%").attr("stop-color", "#fff700").attr("stop-opacity", .42);
    auraGradient.append("stop").attr("offset", "55%").attr("stop-color", "#ff8a00").attr("stop-opacity", .2);
    auraGradient.append("stop").attr("offset", "100%").attr("stop-color", "#ff2bd6").attr("stop-opacity", .03);

    const dial = svg.append("g").attr("transform", `translate(${cx},${cy})`);
    dial.append("circle").attr("class", "solar-outer-track").attr("r", dialRadius);
    dial.append("circle").attr("class", "solar-segment-track").attr("r", (segmentInnerRadius + segmentOuterRadius) / 2);
    dial.append("circle").attr("class", "solar-inner-orbit").attr("r", 215);
    dial.append("circle").attr("class", "solar-inner-orbit orbit-secondary").attr("r", 164);

    const tickLayer = dial.append("g").attr("class", "orbit-ticks solar-ticks");
    d3.range(0, 25, 3).forEach(function(hour) {
      const a = angle(hour) - Math.PI / 2;
      const x1 = Math.cos(a) * (dialRadius - 8);
      const y1 = Math.sin(a) * (dialRadius - 8);
      const x2 = Math.cos(a) * (dialRadius + 7);
      const y2 = Math.sin(a) * (dialRadius + 7);
      const tx = Math.cos(a) * (dialRadius + 25);
      const ty = Math.sin(a) * (dialRadius + 25);

      tickLayer.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
      tickLayer.append("text")
        .attr("x", tx)
        .attr("y", ty + 4)
        .attr("text-anchor", "middle")
        .text(formatHour(hour));
    });

    const energyLayer = dial.append("g").attr("class", "solar-energy-layer");
    const auraPath = energyLayer.append("path").attr("class", "solar-energy-aura");
    const rayLayer = energyLayer.append("g").attr("class", "solar-ray-layer");
    const arcLayer = dial.append("g").attr("class", "schedule-arc-layer solar-arc-layer");
    const arcGenerator = d3.arc().cornerRadius(10).padAngle(0.009);

    const sunCore = dial.append("g").attr("class", "sun-core-group");
    sunCore.append("circle").attr("class", "sun-corona").attr("r", sunRadius + 24);
    sunCore.append("circle").attr("class", "sun-disc").attr("r", sunRadius);
    const sunTitle = sunCore.append("text")
      .attr("class", "sun-core-title")
      .attr("text-anchor", "middle")
      .attr("y", -2);
    const sunSub = sunCore.append("text")
      .attr("class", "sun-core-subtitle")
      .attr("text-anchor", "middle")
      .attr("y", 23);

    function resetSunLabel() {
      sunTitle.text(selectedDay.slice(0, 3).toUpperCase());
      sunSub.text("26H SOLAR LOOP");
    }

    function energyForDay() {
      return d3.range(0, 26).map(function(hour) {
        const active = schedule.find(d => d.day === selectedDay && d.start < hour + 1 && d.end > hour);
        const category = active ? active.category : "Personal";
        const lateBoost = hour >= 22 && category === "Homework" ? 10 : 0;
        return {
          hour,
          category,
          value: Math.min(100, (energyByCategory[category] || 45) + lateBoost)
        };
      });
    }

    function rayPoint(hour, radius) {
      const a = angle(hour + .5) - Math.PI / 2;
      return [Math.cos(a) * radius, Math.sin(a) * radius];
    }

    function updateSun() {
      const energy = energyForDay();
      const energyRadius = d3.scaleLinear().domain([10, 100]).range([116, 203]);
      const radialLine = d3.lineRadial()
        .angle(d => angle(d.hour + .5))
        .radius(d => energyRadius(d.value))
        .curve(d3.curveCardinalClosed.tension(.72));

      auraPath.datum(energy)
        .transition()
        .duration(520)
        .attr("d", radialLine);

      rayLayer.selectAll(".solar-ray")
        .data(energy, d => d.hour)
        .join("line")
        .attr("class", "solar-ray")
        .attr("x1", d => rayPoint(d.hour, sunRadius + 20)[0])
        .attr("y1", d => rayPoint(d.hour, sunRadius + 20)[1])
        .attr("x2", d => rayPoint(d.hour, energyRadius(d.value))[0])
        .attr("y2", d => rayPoint(d.hour, energyRadius(d.value))[1])
        .attr("stroke", d => cyberpunkGradient((d.value - 10) / 90));

      resetSunLabel();
    }

    function key(d) {
      return `${d.day}-${d.start}-${d.end}-${d.activity}`;
    }

    function arcPath(d) {
      return arcGenerator({
        innerRadius: segmentInnerRadius,
        outerRadius: segmentOuterRadius,
        startAngle: angle(d.start),
        endAngle: angle(d.end)
      });
    }

    function updateSchedule() {
      const currentData = schedule.filter(d => d.day === selectedDay)
        .filter(d => !activeFilter.categories || activeFilter.categories.includes(d.category));

      arcLayer.selectAll(".schedule-arc")
        .data(currentData, key)
        .join(
          enter => enter.append("path")
            .attr("class", "schedule-arc")
            .attr("d", arcPath)
            .attr("fill", d => colors[d.category])
            .attr("opacity", 0)
            .call(enter => enter.transition().duration(420).attr("opacity", .88)),
          update => update.call(update => update.transition().duration(360)
            .attr("d", arcPath)
            .attr("fill", d => colors[d.category])
            .attr("opacity", .88)),
          exit => exit.call(exit => exit.transition().duration(240).attr("opacity", 0).remove())
        )
        .on("mouseenter", function(event, d) {
          d3.select(this).raise().attr("opacity", 1).attr("stroke", "#f6f7ff").attr("stroke-width", 2);
          sunTitle.text(labelFor(d).slice(0, 12).toUpperCase());
          sunSub.text(`${formatHour(d.start)}–${formatHour(d.end)}`);
          tip.html(`<strong>${d.activity}</strong><small>${d.day} / ${formatHour(d.start)}–${formatHour(d.end)}</small><small>${d.category} · ${(d.end - d.start).toFixed(1)} hours</small>`)
            .style("opacity", 1);
          positionTooltip(event, tip, containerId);
        })
        .on("mousemove", event => positionTooltip(event, tip, containerId))
        .on("mouseleave", function() {
          d3.select(this).attr("opacity", .88).attr("stroke", "none");
          resetSunLabel();
          tip.style("opacity", 0);
        });
    }

    updateSun();
    updateSchedule();
  }

  function drawCategorySummary() {
    const containerId = "#d3-container-2";
    const container = d3.select(containerId);
    const tip = tooltip(containerId);
    const width = 1000;
    const height = 590;
    const totals = d3.rollups(
      schedule,
      values => d3.sum(values, d => d.end - d.start),
      d => d.category
    ).map(([category, hours]) => ({ category, hours }));

    const svg = chartSvg(container, `0 0 ${width} ${height}`)
      .attr("aria-label", "Packed constellation of weekly activity categories sized by total hours");

    const field = svg.append("g").attr("class", "constellation-field");
    [130, 220, 315, 410].forEach(function(radius, index) {
      field.append("ellipse")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("rx", radius)
        .attr("ry", radius * .48)
        .attr("class", `constellation-orbit orbit-${index}`);
    });

    field.append("line").attr("x1", 70).attr("x2", width - 70).attr("y1", height / 2).attr("y2", height / 2);
    field.append("line").attr("x1", width / 2).attr("x2", width / 2).attr("y1", 40).attr("y2", height - 40);

    const root = d3.pack()
      .size([900, 520])
      .padding(13)(d3.hierarchy({ children: totals }).sum(d => d.hours || 0));

    const nodes = svg.append("g")
      .attr("transform", "translate(50,35)")
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("class", "constellation-node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .on("mouseenter", function(event, d) {
        d3.select(this).raise().classed("is-active", true);
        tip.html(`<strong>${d.data.category}</strong><small>${d.data.hours.toFixed(1)} hours per week</small>`)
          .style("opacity", 1);
        positionTooltip(event, tip, containerId);
      })
      .on("mousemove", event => positionTooltip(event, tip, containerId))
      .on("mouseleave", function() {
        d3.select(this).classed("is-active", false);
        tip.style("opacity", 0);
      });

    nodes.append("circle")
      .attr("class", "constellation-halo")
      .attr("r", d => d.r + 5)
      .attr("stroke", d => colors[d.data.category]);

    nodes.append("circle")
      .attr("class", "constellation-core")
      .attr("r", d => d.r)
      .attr("fill", d => colors[d.data.category]);

    nodes.append("text")
      .attr("class", "constellation-value")
      .attr("text-anchor", "middle")
      .attr("y", d => d.r > 31 ? -2 : 4)
      .text(d => `${d.data.hours.toFixed(1)}h`);

    nodes.filter(d => d.r > 31)
      .append("text")
      .attr("class", "constellation-label")
      .attr("text-anchor", "middle")
      .attr("y", 17)
      .text(d => d.data.category.toUpperCase());
  }

  function drawEnergySignal() {
    const containerId = "#d3-container-3";
    const container = d3.select(containerId);
    const tip = tooltip(containerId);
    const width = 1000;
    const height = 620;
    const margin = { top: 38, right: 28, bottom: 54, left: 116 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const laneHeight = innerHeight / days.length;
    const hours = d3.range(0, 26);
    const x = d3.scaleLinear().domain([0, 25]).range([0, innerWidth]);
    const amplitude = d3.scaleLinear().domain([10, 100]).range([5, laneHeight * .72]);
    const signalColors = ["#00e5ff", "#ff2bd6", "#fff700", "#7a35ff", "#00ffb3", "#ff8a00", "#00a8ff"];

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

    const svg = chartSvg(container, `0 0 ${width} ${height}`)
      .attr("aria-label", "Seven daily energy waveforms across a 26 hour timeline");
    const defs = svg.append("defs");

    signalColors.forEach(function(color, index) {
      const gradient = defs.append("linearGradient")
        .attr("id", `signal-gradient-${index}`)
        .attr("x1", "0").attr("x2", "0").attr("y1", "0").attr("y2", "1");
      gradient.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", .72);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", .04);
    });

    const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    chart.selectAll(".signal-grid-line")
      .data(d3.range(0, 26, 2))
      .enter()
      .append("line")
      .attr("class", "signal-grid-line")
      .attr("x1", d => x(d))
      .attr("x2", d => x(d))
      .attr("y1", 0)
      .attr("y2", innerHeight);

    chart.selectAll(".signal-hour")
      .data(d3.range(0, 26, 2))
      .enter()
      .append("text")
      .attr("class", "signal-hour")
      .attr("x", d => x(d))
      .attr("y", innerHeight + 28)
      .attr("text-anchor", "middle")
      .text(formatHour);

    days.forEach(function(day, dayIndex) {
      const values = cells.filter(d => d.day === day);
      const baseline = dayIndex * laneHeight + laneHeight * .82;
      const line = d3.line()
        .x(d => x(d.hour))
        .y(d => baseline - amplitude(d.value))
        .curve(d3.curveCatmullRom.alpha(.55));
      const area = d3.area()
        .x(d => x(d.hour))
        .y0(baseline)
        .y1(d => baseline - amplitude(d.value))
        .curve(d3.curveCatmullRom.alpha(.55));

      chart.append("line")
        .attr("class", "signal-baseline")
        .attr("x1", 0).attr("x2", innerWidth)
        .attr("y1", baseline).attr("y2", baseline);

      chart.append("text")
        .attr("class", "signal-day")
        .attr("x", -18)
        .attr("y", baseline - 18)
        .attr("text-anchor", "end")
        .attr("fill", signalColors[dayIndex])
        .text(day.toUpperCase());

      chart.append("path")
        .datum(values)
        .attr("class", "energy-area")
        .attr("d", area)
        .attr("fill", `url(#signal-gradient-${dayIndex})`);

      chart.append("path")
        .datum(values)
        .attr("class", "energy-wave")
        .attr("d", line)
        .attr("stroke", signalColors[dayIndex]);

      chart.append("g")
        .selectAll("circle")
        .data(values)
        .enter()
        .append("circle")
        .attr("class", "signal-hit")
        .attr("cx", d => x(d.hour))
        .attr("cy", d => baseline - amplitude(d.value))
        .attr("r", 9)
        .on("mouseenter", function(event, d) {
          d3.select(this).classed("is-active", true);
          tip.html(`<strong>${d.day} · ${formatHour(d.hour)}</strong><small>${d.activity}</small><small>Energy signal ${d.value} / 100</small>`)
            .style("opacity", 1);
          positionTooltip(event, tip, containerId);
        })
        .on("mousemove", event => positionTooltip(event, tip, containerId))
        .on("mouseleave", function() {
          d3.select(this).classed("is-active", false);
          tip.style("opacity", 0);
        });
    });
  }

  drawSchedule();
  drawCategorySummary();
  drawEnergySignal();
})();
